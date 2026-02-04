import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>This is the landing page?</div>,
    },
    {
      path: "/login",
      element: <div>This is the login page</div>,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

//to do:
// / route should be a page where users can select to log in as admin, librarian, student
//or maybe just a regular log in page and then just check the role of the log ins
