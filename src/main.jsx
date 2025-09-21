import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { makeServer } from './server/server.jsx';



(async () => {
  try {
    await makeServer();
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch (error) {
    console.error("Failed to initialize the mock server:", error);
  }
})();