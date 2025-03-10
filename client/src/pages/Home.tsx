import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import CityScene from '@/components/game/CityScene';
import { GameProvider, useGameState } from '@/context/GameContext';

// Debugging overlay component
const DebugOverlay = () => {
  const { gameState } = useGameState();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      {/* Game controls */}
      <div className="fixed bottom-4 left-4 text-white text-sm bg-black/50 p-2 rounded">
        <p>WASD / Arrow Keys - Move</p>
        <p>Mouse - Look around</p>
        <p>Space - Jump</p>
        <button 
          className="mt-2 bg-gray-700 px-2 py-1 rounded text-xs"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide' : 'Show'} Debug Info
        </button>
      </div>
      
      {/* Debug info */}
      {showDetails && (
        <div className="fixed top-4 right-4 text-white text-sm bg-black/70 p-2 rounded max-w-xs overflow-hidden">
          <h3 className="font-bold">Debug Info</h3>
          <p>Keys: {Object.entries(gameState.keys)
            .filter(([_, value]) => value)
            .map(([key]) => key)
            .join(', ') || 'None'}</p>
          <p>Last Error: {gameState.debug.lastError || 'None'}</p>
        </div>
      )}
    </>
  );
};

export default function Home() {
  return (
    <GameProvider>
      <div className="w-screen h-screen">
        <Canvas
          shadows
          camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 2, 5] }}
        >
          <Suspense fallback={null}>
            <CityScene />
          </Suspense>
        </Canvas>
        <DebugOverlay />
      </div>
    </GameProvider>
  );
}
