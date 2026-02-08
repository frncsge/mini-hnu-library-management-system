import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

function LibrarianDashboard({ profile }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    //for refreshing session
    async function fetchRefresh() {
      try {
        const response = await fetch("/api/refresh", {
          method: "POST",
          credentials: "include",
        });
        const data = await response.json();

        return { isRefreshed: response.ok, message: data.message };
      } catch (error) {
        return { isRefreshed: false, message: "Unable to refresh session" };
      }
    }

    async function fetchDashboardData() {
      try {
        const response = await fetch("/api/books/summary", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (response.ok) {
          setDashboard(data.bookDashboardSummary);
          return;
        }

        if (response.status === 401) {
          const refresh = await fetchRefresh();
          if (refresh.isRefreshed) return fetchDashboardData();

          // setError(refresh.message || "Failed to load dashboard data");
        }
      } catch (error) {
        setError("Unable to connect to server");
        console.error("Error fetching book dashboard data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

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

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <>
      <nav className="flex items-center justify-between bg-green-500 px-4 py-5">
        <section className="font-bold text-lg text-white cursor-pointer">
          Mini HNU Library MS
        </section>
        <section>
          <ul className="flex gap-5 text-white">
            <li className="cursor-pointer">Dashboard</li>
            <li className="cursor-pointer">Books</li>
            <li className="cursor-pointer">Borrowed</li>
            <li className="cursor-pointer">Create</li>
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
      <main className="px-4 pt-6">
        {/* profile section */}
        <section className="flex items-start gap-3">
          <div className="w-[100px] h-[100px] bg-gray-200 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">?</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">{`${profile.first_name} ${profile.last_name}`}</h2>
            <p className="text-sm">{profile.email}</p>
          </div>
        </section>
        {/* dashboard data section */}
        <section className="mt-5">
          <h2 className="border-t py-3 text-sm font-bold">
            Current Library Status
          </h2>
          <div className="flex gap-5">
            <div className="flex flex-col gap-4 border border-gray-300 p-2">
              <h3 className="text-sm">Total books</h3>
              <span className="text-xl text-center">{dashboard.total_books}</span>
            </div>
            <div className="flex flex-col gap-4 border border-gray-300 p-2">
              <h3 className="text-sm">Available copies</h3>
              <span className="text-xl text-center">{dashboard.available_copies}</span>
            </div>
            <div className="flex flex-col gap-4 border border-gray-300 p-2">
              <h3 className="text-sm">Borrowed copies</h3>
              <span className="text-xl text-center">{dashboard.borrowed_copies}</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default LibrarianDashboard;
