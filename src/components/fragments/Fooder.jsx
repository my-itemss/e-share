import React from 'react';

function Fooder() {
  return (
    <footer className="bg-gray-100 py-4 mt-8 border-t border-gray-200">
      <div className="container mx-auto px-4 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} PDF Summarizer.  All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Fooder;
