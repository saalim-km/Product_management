import { Toaster } from "sonner";
import { Route, Routes } from "react-router-dom";
import NotFoundPage from "./components/404/NotFoundPage";
import { AuthPage } from "./pages/Auth";
import { AuthRoute, NoAuthRoute } from "./protected/ProtectedRoute";
import ProductManagement from "./pages/Home";
import  ProductDetail  from "./pages/ProductDetails";

function App() {
  return (
    <>
      <Toaster richColors={true} position="top-right"/>
      <Routes>
        <Route path="/auth" element={<NoAuthRoute element={<AuthPage/>}/>} />
        <Route path="/" element={<AuthRoute element={<ProductManagement/>}/>} />
        <Route path="/product/:productId" element={<AuthRoute element={<ProductDetail/>}/>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
