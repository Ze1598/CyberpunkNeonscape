import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { RigidBody, CapsuleCollider, type RapierRigidBody } from '@react-three/rapier';
import { PerspectiveCamera, useKeyboardControls } from '@react-three/drei';
import { type PerspectiveCamera as TPerspectiveCamera } from 'three';
import useControls from '../game/useControls';

export default function Player() {
  const ref = useRef<RapierRigidBody>(null);
  const cameraRef = useRef<TPerspectiveCamera>(null);
  const [, get] = useKeyboardControls();

  const { velocity, onMove, onJump } = useControls();

  // Initialize movement direction vector outside frame loop
  const moveDirection = new Vector3();
  const cameraDirection = new Vector3();

  useFrame((state, delta) => {
    const rigidBody = ref.current;
    if (!rigidBody) return;

    const { forward, backward, left, right, jump } = get();

    // Reset movement direction
    moveDirection.set(0, 0, 0);

    // Get camera direction
    const camera = state.camera;
    camera.getWorldDirection(cameraDirection);

    // Calculate movement based on input
    if (forward) moveDirection.add(cameraDirection);
    if (backward) moveDirection.sub(cameraDirection);
    if (right) moveDirection.add(cameraDirection.cross(camera.up).normalize());
    if (left) moveDirection.sub(cameraDirection.cross(camera.up).normalize());

    // Normalize horizontal movement
    moveDirection.y = 0;
    if (moveDirection.lengthSq() > 0) {
      moveDirection.normalize();
    }

    // Apply movement and jump
    onMove(moveDirection, delta);
    if (jump) onJump();

    // Update camera position to follow player
    const playerPosition = rigidBody.translation();
    camera.position.set(
      playerPosition.x,
      playerPosition.y + 1.5,
      playerPosition.z
    );
  });

  return (
    <RigidBody
      ref={ref}
      position={[0, 2, 0]}
      enabledRotations={[false, false, false]}
      mass={1}
      type="dynamic"
      colliders={false}
    >
      <CapsuleCollider args={[0.5, 0.4]} />
      <PerspectiveCamera ref={cameraRef} makeDefault />
    </RigidBody>
  );
}