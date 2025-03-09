import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import CityScene from '@/components/game/CityScene';

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
          { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
          { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
          { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
          { name: 'jump', keys: ['Space'] }
        ]}
      >
        <Canvas
          shadows
          camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 2, 5] }}
        >
          <CityScene />
        </Canvas>
      </KeyboardControls>
      
      <div className="fixed bottom-4 left-4 text-white text-sm bg-black/50 p-2 rounded">
        <p>WASD / Arrow Keys - Move</p>
        <p>Mouse - Look around</p>
        <p>Space - Jump</p>
      </div>
    </div>
  );
}
