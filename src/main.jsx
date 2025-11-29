import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/global.css';
import { UserCodeProvider } from './context/UserCodeContext.jsx';
import { RoadmapProvider } from './context/RoadmapContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserCodeProvider>
        <RoadmapProvider>
          <App />
        </RoadmapProvider>
      </UserCodeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

