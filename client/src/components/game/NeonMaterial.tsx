import { shaderMaterial } from '@react-three/drei';
import { extend, ReactThreeFiber } from '@react-three/fiber';
import { useMemo } from 'react';

const NeonMaterialImpl = shaderMaterial(
  { 
    time: 0, 
    color: [0.3, 0.2, 0.6], 
    intensity: 1.5 
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec3 color;
    uniform float intensity;
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vec3 glow = color * intensity;
      float pulse = sin(time * 2.0) * 0.5 + 0.5;
      vec3 finalColor = glow * (0.8 + pulse * 0.2);
      float edgePulse = pow(1.0 - abs(vUv.x - 0.5) * 2.0, 2.0);
      finalColor *= edgePulse;
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ NeonMaterialImpl });

// Add type declaration for the material
declare global {
  namespace JSX {
    interface IntrinsicElements {
      neonMaterialImpl: ReactThreeFiber.MaterialNode<typeof NeonMaterialImpl, typeof NeonMaterialImpl>;
    }
  }
}

interface NeonMaterialProps {
  color?: [number, number, number];
  intensity?: number;
}

export default function NeonMaterial({ color = [0.8, 0.2, 0.8], intensity = 1.5 }: NeonMaterialProps) {
  const material = useMemo(() => new NeonMaterialImpl(), []);
  return (
    <neonMaterialImpl 
      ref={material}
      transparent
      color={color}
      intensity={intensity}
      toneMapped={false}
    />
  );
}