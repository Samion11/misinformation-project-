import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Custom plugin to fix missing MIME-types for .jsx files on some Windows environments
const jsxMimeFix = () => ({
  name: 'jsx-mime-fix',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url.includes('.jsx')) {
        res.setHeader('Content-Type', 'text/javascript');
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), jsxMimeFix()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  }
})
