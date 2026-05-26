import { Route, Routes } from "react-router";
import HomePage from "./feature/shell/pages/HomePage";
import Layout from "./feature/shell/Layout";
import ProductDetailPage from "./feature/shell/pages/ProductDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
