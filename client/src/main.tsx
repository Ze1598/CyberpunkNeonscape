import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Make sure React is properly initialized before rendering
const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
