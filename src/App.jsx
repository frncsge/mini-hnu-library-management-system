import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LoginPage from "./pages/LoginPage.jsx";
import VerifyOtpPage from "./pages/VerifyOtpPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import LibrarianDashboard from "./pages/LibrarianDashboard.jsx";
import StudentHomePage from "./pages/StudentHomePage.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>Default Page temporary</div>,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/login/verify-otp",
      element: <VerifyOtpPage />,
    },
    {
      path: "/admin/dashboard",
      element: <AdminDashboard />,
    },
    {
      path: "/librarian/dashboard",
      element: <LibrarianDashboard />,
    },
    {
      path: "/student/homepage",
      element: <StudentHomePage />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
