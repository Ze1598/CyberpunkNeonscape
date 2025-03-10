import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

// Simple component with no dependencies
function MinimalApp() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#111',
      color: 'white'
    }}>
      <h1>Cyberpunk Neonscape</h1>
      <p>Minimal version to diagnose React issues</p>
      <button 
        style={{
          margin: '20px',
          padding: '10px 20px',
          backgroundColor: '#ff00ff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={() => setCount(count + 1)}
      >
        Clicked {count} times
      </button>
      <div>
        <p>If this works, we have a React initialization issue in the main app.</p>
        <a 
          href="/" 
          style={{
            color: '#00ffff',
            textDecoration: 'underline',
            marginTop: '20px',
            display: 'inline-block'
          }}
        >
          Try main app again
        </a>
      </div>
    </div>
  );
}

// Plain JavaScript to mount React
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <MinimalApp />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found!');
} 