import { RigidBody } from '@react-three/rapier';
import { Vector3Tuple } from 'three';
import NeonMaterial from '../game/NeonMaterial';

interface BuildingProps {
  position: Vector3Tuple;
  scale: Vector3Tuple;
}

export default function Building({ position, scale }: BuildingProps) {
  return (
    <RigidBody type="fixed" position={position}>
      <mesh scale={scale} castShadow receiveShadow>
        <boxGeometry />
        <NeonMaterial color={[0.8, 0.2, 0.8]} intensity={1.5} />
      </mesh>
    </RigidBody>
  );
}