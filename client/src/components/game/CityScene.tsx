import React, { Suspense } from 'react';
import { Physics } from '@react-three/rapier';
import { Sky, Stars } from '@react-three/drei';
import { Vector3Tuple } from 'three';
import Player from '../game/Player';
import Building from '../game/Building';
import Floor from '../game/Floor';

interface Building {
  position: Vector3Tuple;
  scale: Vector3Tuple;
}

export default function CityScene() {
  // City layout configuration
  const buildings: Building[] = [
    { position: [-10, 0, -10] as Vector3Tuple, scale: [4, 15, 4] as Vector3Tuple },
    { position: [10, 0, -10] as Vector3Tuple, scale: [4, 20, 4] as Vector3Tuple },
    { position: [-10, 0, 10] as Vector3Tuple, scale: [4, 12, 4] as Vector3Tuple },
    { position: [10, 0, 10] as Vector3Tuple, scale: [4, 18, 4] as Vector3Tuple },
    { position: [0, 0, -15] as Vector3Tuple, scale: [4, 25, 4] as Vector3Tuple },
    { position: [-15, 0, 0] as Vector3Tuple, scale: [4, 16, 4] as Vector3Tuple },
    { position: [15, 0, 0] as Vector3Tuple, scale: [4, 22, 4] as Vector3Tuple },
    { position: [0, 0, 15] as Vector3Tuple, scale: [4, 14, 4] as Vector3Tuple },
  ];

  return (
    <Suspense fallback={null}>
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 20, 10]} intensity={0.5} color="#ff00ff" />
      <pointLight position={[-10, 20, -10]} intensity={0.5} color="#00ffff" />

      {/* Environment */}
      <Sky distance={450000} sunPosition={[0, -1, 0]} inclination={0} />
      <Stars radius={100} depth={50} count={5000} factor={4} />
      <fog attach="fog" args={['#000000', 10, 50]} />

      {/* Physics World */}
      <Physics gravity={[0, -30, 0]} interpolate={false}>
        {/* Player */}
        <Player />

        {/* Buildings */}
        {buildings.map((building, index) => (
          <Building
            key={index}
            position={building.position}
            scale={building.scale}
          />
        ))}

        {/* Ground */}
        <Floor />
      </Physics>
    </Suspense>
  );
}