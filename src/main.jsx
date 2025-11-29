import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/global.css';
import { UserCodeProvider } from './context/UserCodeContext.jsx';
import { RoadmapProvider } from './context/RoadmapContext.jsx';
import { UniversitiesProvider } from './context/UniversitiesContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <UserCodeProvider>
            <UniversitiesProvider>
              <RoadmapProvider>
                <App />
              </RoadmapProvider>
            </UniversitiesProvider>
          </UserCodeProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>,
  );
} catch (error) {
  console.error('Failed to render app:', error);
  document.body.innerHTML = `
    <div style="padding: 2rem; color: #fff; text-align: center; background: #05080f; min-height: 100vh;">
      <h1>Failed to load application</h1>
      <p>${error.message}</p>
      <pre style="text-align: left; background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 0.5rem; overflow: auto;">${error.stack}</pre>
    </div>
  `;
}

