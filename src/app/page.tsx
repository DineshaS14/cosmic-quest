import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-8">Welcome to Cosmic Quest Adventure!</h1>
      <Link href="/cosmic-Adventure">
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition duration-300">
          Start Cosmic Quest Adventure
        </button>
      </Link>
    </div>
  );
}
