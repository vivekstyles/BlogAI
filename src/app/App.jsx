import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AppRouter from './router';

export function App() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <AppRouter />
      </main>
      <Footer />
    </>
  );
}

export default App;
