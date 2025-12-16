import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Erro ao renderizar o app:", error);
  rootElement.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>Erro ao carregar</h1><p>Verifique o console para mais detalhes.</p></div>';
}