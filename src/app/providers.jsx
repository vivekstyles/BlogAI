import React from 'react';
import { BrowserRouter } from 'react-router-dom';

export function Providers({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

export default Providers;
