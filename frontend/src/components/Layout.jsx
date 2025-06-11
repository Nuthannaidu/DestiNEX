// src/components/Layout.jsx
import React from 'react';
import Navbar from './navbar';
import Footer from './Footer';
import Flash from './Flash';

const Layout = ({ children }) => {
  return (
    <>
      {/* HTML Head equivalent via react-helmet (optional) */}
      <Navbar />
      <div className="container flex-grow-1 mt-3">
        <Flash />
        {children}
      </div>
      <Footer />

      {/* Scripts (if needed, usually for Bootstrap) */}
      {/* These are usually placed in index.html or loaded via CDN/package.json */}
    </>
  );
};

export default Layout;
