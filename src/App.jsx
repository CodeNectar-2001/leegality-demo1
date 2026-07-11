import React from "react";
import { Routes, Route } from 'react-router-dom'
import ProductListing from './pages/ProductListing.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductListing />} />
 
    </Routes>
  )
}
