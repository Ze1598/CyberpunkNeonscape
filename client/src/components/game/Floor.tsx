import { RigidBody } from '@react-three/rapier';

export default function Floor() {
  return (
    <RigidBody type="fixed" position={[0, -0.5, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>
    </RigidBody>
  );
}
