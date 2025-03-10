import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vector3 } from 'three';

// Game state type definition
interface GameState {
  keys: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
  };
  debug: {
    lastError: string | null;
  };
}

// Initial game state
const initialGameState: GameState = {
  keys: {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  },
  debug: {
    lastError: null
  }
};

// Create context with default values
const GameContext = createContext<{
  gameState: GameState;
  setError: (error: string | null) => void;
}>({
  gameState: initialGameState,
  setError: () => {},
});

// Export the hook for using game state
export const useGameState = () => useContext(GameContext);

interface GameProviderProps {
  children: ReactNode;
}

// Game Provider component
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  // Function to set an error in the game state
  const setError = (error: string | null) => {
    setGameState(prev => ({
      ...prev,
      debug: {
        ...prev.debug,
        lastError: error
      }
    }));
  };

  // Handle keyboard input with proper error handling
  useEffect(() => {
    // Allow page to fully initialize before adding listeners
    const setupKeyboardListeners = () => {
      const handleKeyDown = (e: KeyboardEvent) => {
        try {
          // Prevent default behavior for game controls
          if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
            e.preventDefault();
          }

          const key = e.key.toLowerCase();
          
          setGameState(prev => {
            // Create a new keys object to ensure React detects the state change
            const newKeys = { ...prev.keys };
            
            // Set the appropriate key state
            if (key === 'w' || key === 'arrowup') newKeys.forward = true;
            if (key === 's' || key === 'arrowdown') newKeys.backward = true;
            if (key === 'a' || key === 'arrowleft') newKeys.left = true;
            if (key === 'd' || key === 'arrowright') newKeys.right = true;
            if (key === ' ') newKeys.jump = true;
            
            return {
              ...prev,
              keys: newKeys
            };
          });
        } catch (err) {
          console.error('Error handling keydown:', err);
          setError(`KeyDown error: ${err}`);
        }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        try {
          const key = e.key.toLowerCase();
          
          setGameState(prev => {
            // Create a new keys object to ensure React detects the state change
            const newKeys = { ...prev.keys };
            
            // Set the appropriate key state
            if (key === 'w' || key === 'arrowup') newKeys.forward = false;
            if (key === 's' || key === 'arrowdown') newKeys.backward = false;
            if (key === 'a' || key === 'arrowleft') newKeys.left = false;
            if (key === 'd' || key === 'arrowright') newKeys.right = false;
            if (key === ' ') newKeys.jump = false;
            
            return {
              ...prev,
              keys: newKeys
            };
          });
        } catch (err) {
          console.error('Error handling keyup:', err);
          setError(`KeyUp error: ${err}`);
        }
      };

      // Add event listeners
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    };

    // Setup with a slight delay to ensure React is fully initialized
    const timeout = setTimeout(setupKeyboardListeners, 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <GameContext.Provider value={{ gameState, setError }}>
      {children}
    </GameContext.Provider>
  );
}; 