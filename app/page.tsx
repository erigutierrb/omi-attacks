import dynamic from 'next/dynamic';

const GameComponent = dynamic(() => import('./gameComponent'), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2">
      <GameComponent />
    </main>
  );
}