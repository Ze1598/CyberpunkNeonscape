import { useState, useEffect, useCallback } from 'react';
import { Vector3 } from 'three';

export default function useControls() {
  const [velocity] = useState(() => new Vector3());
  const moveSpeed = 5;
  const jumpForce = 8;
  const [canJump, setCanJump] = useState(true);

  const onMove = useCallback((direction: Vector3, delta: number) => {
    velocity.x = direction.x * moveSpeed;
    velocity.z = direction.z * moveSpeed;
  }, [velocity]);

  const onJump = useCallback(() => {
    if (canJump) {
      velocity.y = jumpForce;
      setCanJump(false);
      setTimeout(() => {
        setCanJump(true);
      }, 1000);
    }
  }, [velocity, canJump]);

  useEffect(() => {
    // Reset velocity when component unmounts
    return () => {
      velocity.set(0, 0, 0);
    };
  }, [velocity]);

  return {
    velocity,
    onMove,
    onJump
  };
}