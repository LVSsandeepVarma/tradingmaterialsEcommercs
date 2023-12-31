import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import LanguageSwitcher from './app/languageSwitcher';
import { I18nextProvider } from 'react-i18next';
import i18n from './app/i18n';
import { HelmetProvider } from 'react-helmet-async';
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  // <React.StrictMode>
  <I18nextProvider i18n={i18n}>
  <LanguageSwitcher>
    <HelmetProvider>
    <Provider store={store}>
      <App />
    </Provider>
    </HelmetProvider>
    </LanguageSwitcher>
    </I18nextProvider>

  // {/* </React.StrictMode> */}
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
