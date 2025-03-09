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
import React from 'react';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from '@/components/ui/navigation-menu';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background p-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="font-bold text-xl">
              Your App
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>
      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold tracking-tight mb-6">Welcome to Your App</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          This is a starter template with Express backend and React frontend.
        </p>
        <Button>Get Started</Button>
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Your App
      </footer>
    </div>
  );
}
