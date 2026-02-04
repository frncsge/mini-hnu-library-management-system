import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LoginPage from "./pages/LoginPage.jsx";

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
  ]);

  return <RouterProvider router={router} />;
}

export default App;

//to do:
// / route should be a page where users can select to log in as admin, librarian, student
//or maybe just a regular log in page and then just check the role of the log ins
