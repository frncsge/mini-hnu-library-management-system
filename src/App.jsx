import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LoginPage from "./pages/LoginPage.jsx";
import VerifyOtpPage from "./pages/VerifyOtpPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import LibrarianDashboard from "./pages/LibrarianDashboard.jsx";
import StudentHomePage from "./pages/StudentHomePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import StudentRegisterPage from "./pages/StudentRegisterPage.jsx";
import DefaultPage from "./pages/DefaultPage.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <DefaultPage />,
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
      path: "/student/register",
      element: <StudentRegisterPage />,
    },
    {
      path: "/admin/dashboard",
      element: <AdminDashboard />,
    },
    {
      path: "/librarian/dashboard",
      element: (
        <ProtectedRoute allowedRoles={["librarian"]}>
          <LibrarianDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/student/home",
      element: (
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentHomePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/books",
      element: <div>Books</div>,
    }, 
    {
      path: "/student/borrowed",
      element: <div>Borrowed books</div>
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
