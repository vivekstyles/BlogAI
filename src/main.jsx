import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import Providers from './app/providers';
import App from './app/App';
import './styles/variables.css';
import './styles/global.css';
import './styles/responsive.css';

const container = document.getElementById('root');

if (container.hasChildNodes()) {
  hydrateRoot(
    container,
    <React.StrictMode>
      <Providers>
        <App />
      </Providers>
    </React.StrictMode>
  );
} else {
  createRoot(container).render(
    <React.StrictMode>
      <Providers>
        <App />
      </Providers>
    </React.StrictMode>
  );
}
