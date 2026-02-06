import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LoginPage from "./pages/LoginPage.jsx";
import VerifyOTP from "./pages/VerifyOTP.jsx";
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
      element: <VerifyOTP />,
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

//to do:
// / route should be a page where users can select to log in as admin, librarian, student
//or maybe just a regular log in page and then just check the role of the log ins
