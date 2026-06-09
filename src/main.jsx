import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; 
import './index.css'; // Your Tailwind CSS styles
import { AppProvider } from './context/AppContext.jsx';
import { StudentProvider } from './context/StudentContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <StudentProvider>
        <App />
      </StudentProvider>
    </AppProvider>
  </React.StrictMode>
);