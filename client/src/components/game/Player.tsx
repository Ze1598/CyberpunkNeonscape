import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { RigidBody, CapsuleCollider, type RapierRigidBody } from '@react-three/rapier';
import { PerspectiveCamera } from '@react-three/drei';
import { type PerspectiveCamera as TPerspectiveCamera } from 'three';
import { useGameState } from '@/context/GameContext';

// Movement constants
const MOVE_SPEED = 5;
const JUMP_FORCE = 8;

export default function Player() {
  const ref = useRef<RapierRigidBody>(null);
  const cameraRef = useRef<TPerspectiveCamera>(null);
  const { gameState, setError } = useGameState();
  
  // Jumping state
  const canJumpRef = useRef(true);
  
  // Create persistent vectors to avoid garbage collection
  const moveDirection = new Vector3();
  const cameraDirection = new Vector3();
  const UP = new Vector3(0, 1, 0);

  useFrame((state, delta) => {
    try {
      const rigidBody = ref.current;
      if (!rigidBody) return;

      // Reset movement direction
      moveDirection.set(0, 0, 0);

      // Get keyboard state
      const { keys } = gameState;

      // Get camera direction for movement relative to view
      if (cameraRef.current) {
        const camera = cameraRef.current;
        camera.getWorldDirection(cameraDirection);
        cameraDirection.y = 0; // Keep movement horizontal
        if (cameraDirection.length() > 0) {
          cameraDirection.normalize();
        }

        // Calculate movement based on input
        if (keys.forward) moveDirection.add(cameraDirection);
        if (keys.backward) moveDirection.sub(cameraDirection);
        if (keys.right) moveDirection.add(cameraDirection.cross(UP).normalize());
        if (keys.left) moveDirection.sub(cameraDirection.cross(UP).normalize());

        // Normalize movement vector
        if (moveDirection.lengthSq() > 0) {
          moveDirection.normalize();
        }

        // Apply movement
        const linearVel = rigidBody.linvel();
        rigidBody.setLinvel({
          x: moveDirection.x * MOVE_SPEED * delta,
          y: linearVel.y,
          z: moveDirection.z * MOVE_SPEED * delta
        }, true);

        // Apply jump force if needed
        if (keys.jump && canJumpRef.current) {
          rigidBody.setLinvel({
            x: linearVel.x,
            y: JUMP_FORCE,
            z: linearVel.z
          }, true);
          
          canJumpRef.current = false;
          setTimeout(() => {
            canJumpRef.current = true;
          }, 1000);
        }
      }

      // Update camera position to follow player
      const playerPosition = rigidBody.translation();
      state.camera.position.set(
        playerPosition.x,
        playerPosition.y + 1.5,
        playerPosition.z
      );
    } catch (error) {
      // Report any errors to the game context
      console.error('Error in Player update:', error);
      setError(`Player error: ${error}`);
    }
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
      <PerspectiveCamera ref={cameraRef} makeDefault fov={75} />
    </RigidBody>
  );
}