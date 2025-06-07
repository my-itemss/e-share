import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/code/HomePage';
import Header from './components/fragments/Header';
import Fooder from './components/fragments/Fooder';
import About from './pages/About';
import Features from './pages/Features';

function App() {
  return (
    <Router>
      <Header /> {/* Header outside the Routes, so it's always visible */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HomePage /> {/* HomePage is rendered within the layout */}
            </>
          }
        />
        <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
           <Route path="/docs" element={<Features />} />
            <Route path="/contact" element={<Features />} />
             <Route path="/pricing" element={<Features />} />
      </Routes>
      <Fooder /> {/* Footer outside the Routes, so it's always visible */}
    </Router>
  );
}

export default App;
