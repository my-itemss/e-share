// src/components/Header.js
import React from 'react';

function Header() {
  return (
    <header className="bg-purple-700 text-white py-4 shadow-md">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold">PDF Summarizer</h1>
        <p className="text-sm">Get concise summaries of your PDF documents.</p>
      </div>
    </header>
  );
}

export default Header;
