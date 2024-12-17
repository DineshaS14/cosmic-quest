'use client';
import React, { useEffect, useState, useRef } from 'react';

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  life: number;
}

interface Bullet {
  x: number;
  y: number;
  speed: number;
}

interface Enemy {
  x: number;
  y: number;
  speed: number;
}

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [player, setPlayer] = useState<Player>({
    x: 225,
    y: 450,
    width: 50,
    height: 50,
    life: 100,
  });
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [score, setScore] = useState<number>(0);
  const [spacePressed, setSpacePressed] = useState<boolean>(false);

  const playerSpeed = 5;
  const bulletSpeed = 7;
  const enemySpeed = 2;
  const playerImageRef = useRef<HTMLImageElement | null>(null);

  // Load the player image
  useEffect(() => {
    const playerImage = new Image();
    playerImage.src = '/images/fighterJet.jpg'; // Path to the image in the public folder
    playerImage.onload = () => {
      playerImageRef.current = playerImage;
    };
  }, []);

  // Handle player movement
  const handleKeyPress = (e: KeyboardEvent) => {
    setPlayer((prev) => {
      let newX = prev.x;
      let newY = prev.y;

      if (e.key === 'ArrowLeft') newX = Math.max(prev.x - playerSpeed, 0);
      if (e.key === 'ArrowRight')
        newX = Math.min(prev.x + playerSpeed, 450 - prev.width);
      if (e.key === 'ArrowUp') newY = Math.max(prev.y - playerSpeed, 0);
      if (e.key === 'ArrowDown') newY = Math.min(prev.y + playerSpeed, 500 - prev.height);

      return { ...prev, x: newX, y: newY };
    });

    if (e.code === 'Space') setSpacePressed(true);
  };

  const handleKeyRelease = (e: KeyboardEvent) => {
    if (e.code === 'Space') setSpacePressed(false);
  };

  // Update bullets, enemies, and game logic
  useEffect(() => {
    const interval = setInterval(() => {
      // Shoot bullets if spacebar is pressed
      if (spacePressed) {
        setBullets((prev) => [
          ...prev,
          {
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            speed: bulletSpeed,
          },
        ]);
      }

      // Update bullets (only Y position changes)
      setBullets((prev) =>
        prev
          .map((b) => ({
            ...b,
            y: b.y - b.speed,
          }))
          .filter((b) => b.y > -10)
      );

      // Update enemies (only Y position changes)
      setEnemies((prev) =>
        prev
          .map((e) => ({
            ...e,
            y: e.y + e.speed,
          }))
          .filter((e) => e.y < 500)
      );

      spawnEnemies();
      detectCollisions();
      detectPlayerHits();
    }, 30);

    return () => clearInterval(interval);
  }, [spacePressed, player]);

  const spawnEnemies = () => {
    if (Math.random() < 0.02) {
      setEnemies((prev) => [
        ...prev,
        {
          x: Math.random() * 400,
          y: 0,
          speed: enemySpeed,
        },
      ]);
    }
  };

  const detectCollisions = () => {
    setBullets((bullets) =>
      bullets.filter((bullet) => {
        let hit = false;
        setEnemies((enemies) =>
          enemies.filter((enemy) => {
            if (
              bullet.x < enemy.x + 50 &&
              bullet.x + 5 > enemy.x &&
              bullet.y < enemy.y + 50 &&
              bullet.y + 10 > enemy.y
            ) {
              hit = true;
              setScore((prev) => prev + 10);
              return false;
            }
            return true;
          })
        );
        return !hit;
      })
    );
  };

  const detectPlayerHits = () => {
    setEnemies((enemies) =>
      enemies.filter((enemy) => {
        if (
          player.x < enemy.x + 50 &&
          player.x + player.width > enemy.x &&
          player.y < enemy.y + 50 &&
          player.y + player.height > enemy.y
        ) {
          setPlayer((prev) => ({ ...prev, life: prev.life - 10 }));
          return false;
        }
        return true;
      })
    );
  };

  // Draw on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context || !canvas) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player image
    if (playerImageRef.current) {
      context.drawImage(
        playerImageRef.current,
        player.x,
        player.y,
        player.width,
        player.height
      );
    } else {
      // Fallback: draw rectangle if image fails to load
      context.fillStyle = 'blue';
      context.fillRect(player.x, player.y, player.width, player.height);
    }

    // Draw bullets
    context.fillStyle = 'yellow';
    bullets.forEach((bullet) => {
      context.fillRect(bullet.x, bullet.y, 5, 10);
    });

    // Draw enemies
    context.fillStyle = 'red';
    enemies.forEach((enemy) => {
      context.fillRect(enemy.x, enemy.y, 50, 50);
    });

    // Draw score
    context.fillStyle = 'white';
    context.font = '20px Arial';
    context.fillText(`Score: ${score}`, 10, 20);

    // Draw life bar
    context.fillStyle = 'green';
    context.fillRect(10, 30, player.life * 2, 20);
    context.strokeStyle = 'white';
    context.strokeRect(10, 30, 200, 20);
  }, [player, bullets, enemies, score]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyRelease);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyRelease);
    };
  }, []);

  return (
    <div className="bg-black h-screen flex items-center justify-center">
      <canvas ref={canvasRef} width={500} height={500} className="border border-gray-600" />
    </div>
  );
};

export default Game;
