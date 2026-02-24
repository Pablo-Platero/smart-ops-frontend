import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import LoginPage from "./pages/LoginPage";

export default function App() {
  
  
  return <RouterProvider router={router} />;
}
