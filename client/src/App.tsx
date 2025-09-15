import { Toaster } from "sonner";
import { Route, Routes } from "react-router-dom";
import NotFoundPage from "./components/404/NotFoundPage";
import { AuthPage } from "./pages/Auth";
import { NoAuthRoute } from "./protected/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster richColors={true} position="top-right"/>
      <Routes>
        <Route path="/auth" element={<NoAuthRoute element={<AuthPage/>}/>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
