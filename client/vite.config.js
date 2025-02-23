import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // Ensure the build output goes to "dist"
  },
  server: {
    proxy: {
      "/api": "http://localhost:3001", // Proxy API requests to Express during development
      "/socket.io": {
        target: "http://localhost:3001",
        ws: true, // Enable WebSockets
      },
    },
  },
});



// localhost ver. 
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
