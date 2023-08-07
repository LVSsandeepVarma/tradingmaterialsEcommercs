import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useRoutes } from 'react-router-dom';

const LanguageSwitcher = ({ children }) => {
  const { i18n } = useTranslation();
  const location = window.location.pathname

  useEffect(() => {
    const language = location.startsWith('/ms') ? "ms" : "en";

    i18n.changeLanguage(language);
  }, [i18n, location]);

// useEffect(() => {
//     const currentPath = window.location.pathname;
//     const language = currentPath.startsWith('/ch') ? 'ch' : currentPath.startsWith('/mal') ? 'mal' : '';
//     const newPath = currentPath.replace(/^\/(ch|mal)/, `/${language}`);
//     window.history.replaceState(null, null, newPath);
//     if(language === ""){
//         i18n.changeLanguage("en");
//     }else{
//         i18n.changeLanguage(language);
//     }
    
//   }, [i18n]);

  return <>{children}</>;
};

export default LanguageSwitcher;
