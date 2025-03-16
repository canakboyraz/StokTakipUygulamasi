import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import Home from './pages/Home';
import StockEntry from './pages/StockEntry';
import StockView from './pages/StockView';
import StockOut from './pages/StockOut';
import StockOutHistory from './pages/StockOutHistory';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <ProductProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stock-entry" element={<StockEntry />} />
            <Route path="/stock-view" element={<StockView />} />
            <Route path="/stock-out" element={<StockOut />} />
            <Route path="/stock-out-history" element={<StockOutHistory />} />
          </Routes>
        </div>
      </Router>
    </ProductProvider>
  );
}

export default App; 