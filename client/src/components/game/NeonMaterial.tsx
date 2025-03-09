import { shaderMaterial } from '@react-three/drei';
import { extend, type ThreeElements } from '@react-three/fiber';
import { ShaderMaterial } from 'three';

// Create shader material
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

// Extend Three.js with our custom material
extend({ NeonMaterialImpl });

// Declare types for our custom material
type NeonMaterialImplType = ShaderMaterial & {
  time: number;
  color: [number, number, number];
  intensity: number;
};

declare module '@react-three/fiber' {
  interface ThreeElements {
    neonMaterialImpl: ThreeElements['shaderMaterial'] & {
      time?: number;
      color?: [number, number, number];
      intensity?: number;
    };
  }
}

interface NeonMaterialProps {
  color?: [number, number, number];
  intensity?: number;
}

export default function NeonMaterial({ color = [0.8, 0.2, 0.8], intensity = 1.5 }: NeonMaterialProps) {
  return (
    <neonMaterialImpl
      key={`neon-${color.join('-')}`}
      transparent
      color={color}
      intensity={intensity}
      toneMapped={false}
      time={0}
    />
  );
}