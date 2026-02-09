import { useState } from "react";
import { useNavigate, Link } from "react-router";

function NavigationBar({ profile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isLibrarian = profile.user_role === "librarian";
  const navItems = isLibrarian
    ? [
        { name: "Dashboard", path: "/librarian/dashboard" },
        { name: "Books", path: "/books" },
      ]
    : [
        { name: "Home", path: "/student/home" },
        { name: "Books", path: "/books" },
        { name: "Borrowed", path: "/student/borrowed" },
      ];

  async function handleLogout() {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        return alert(data.message || "Logout failed");
      }

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error logging out", error);
      alert("Unable to connect to the server");
    }
  }

  return (
    <nav className="flex items-center justify-between bg-green-500 px-4 py-5">
      <section className="font-bold text-lg text-white cursor-pointer">
        Mini HNU Library MS
      </section>
      <section>
        <ul className="flex gap-5 text-white">
          {navItems.map((item) => {
            return (
              <li className="cursor-pointer">
                <Link to={`${item.path}`}>{item.name}</Link>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="relative text-white">
        <p
          className="select-none cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >{`${profile.first_name} ${profile.last_name}`}</p>
        {menuOpen && (
          <div
            className="absolute w-full border border-gray-300 bg-white p-2 cursor-pointer"
            onClick={handleLogout}
          >
            <span className="text-black">Logout</span>
          </div>
        )}
      </section>
    </nav>
  );
}

export default NavigationBar;
