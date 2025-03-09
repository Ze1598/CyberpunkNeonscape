import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import { PerspectiveCamera, useKeyboardControls } from '@react-three/drei';
import useControls from './useControls';
import type { RapierRigidBody } from '@react-three/rapier';
import { type PerspectiveCamera as TPerspectiveCamera } from 'three';

export default function Player() {
  const ref = useRef<RapierRigidBody>(null);
  const cameraRef = useRef<TPerspectiveCamera>(null);
  const [, get] = useKeyboardControls();

  const { velocity, onMove, onJump } = useControls();

  useFrame((state, delta) => {
    if (!ref.current) return;

    const { forward, backward, left, right, jump } = get();

    // Handle movement
    const moveDirection = new Vector3();
    const camera = state.camera;
    const cameraDirection = new Vector3();
    camera.getWorldDirection(cameraDirection);

    if (forward) {
      moveDirection.add(cameraDirection);
    }
    if (backward) {
      moveDirection.sub(cameraDirection);
    }
    if (right) {
      moveDirection.add(cameraDirection.cross(camera.up).normalize());
    }
    if (left) {
      moveDirection.sub(cameraDirection.cross(camera.up).normalize());
    }

    moveDirection.y = 0;
    moveDirection.normalize();

    onMove(moveDirection, delta);

    if (jump) {
      onJump();
    }

    // Update camera position
    const playerPosition = ref.current.translation();
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