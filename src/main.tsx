import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/Index.css';
import App from './App.tsx';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './hooks/store.ts';

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
}