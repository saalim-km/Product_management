import { Toaster } from "sonner";
import { Route, Routes } from "react-router-dom";
import NotFoundPage from "./components/404/NotFoundPage";
import AuthForm from "./pages/Auth";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<AuthForm />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
