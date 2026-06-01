import React, { createContext, useState, useContext, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'PHP');
  const [lowStockThreshold, setLowStockThreshold] = useState(
    parseInt(localStorage.getItem('lowStockThreshold')) || 10
  );

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('lowStockThreshold', lowStockThreshold.toString());
  }, [lowStockThreshold]);

  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: currency,
    });
    return formatter.format(value);
  };

  return (
    <SettingsContext.Provider 
      value={{ 
        theme, setTheme, 
        currency, setCurrency, 
        lowStockThreshold, setLowStockThreshold,
        formatCurrency
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
