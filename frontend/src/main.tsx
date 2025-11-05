import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/Index.css';
import App from './App.tsx';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './hooks/store.ts';
import ScrollToTop from './components/ScrollToTop.tsx';

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter basename="/Frontend-Final">
          <ScrollToTop/>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
}
