import React from "react";
import { Routes, Route } from "react-router-dom";
import ProductListing from "./pages/ProductListing.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductListing />} />
      <Route path="/product/:id" element={<ProductDetail />} />
    </Routes>
  );
}
