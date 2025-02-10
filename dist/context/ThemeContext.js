import React, { createContext, useContext, useState, useEffect } from 'react';
const ThemeContext = createContext({
    theme: 'light',
    accentColor: 'yellow',
    setTheme: () => { },
    setAccentColor: () => { },
});
export const useTheme = () => useContext(ThemeContext);
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved || 'light';
    });
    const [accentColor, setAccentColor] = useState(() => {
        return localStorage.getItem('accentColor') || 'yellow';
    });
    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
    }, [theme]);
    useEffect(() => {
        localStorage.setItem('accentColor', accentColor);
        document.documentElement.style.setProperty('--accent-color', accentColor);
    }, [accentColor]);
    return (<ThemeContext.Provider value={{ theme, accentColor, setTheme, setAccentColor }}>
      {children}
    </ThemeContext.Provider>);
};
