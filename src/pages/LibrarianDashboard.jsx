import { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar";

function LibrarianDashboard({ profile }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);

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

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <>
      <NavigationBar profile={profile}/>
      <main className="px-4 pt-6">
        {/* profile section */}
        <section className="flex items-start gap-3">
          <div className="w-[100px] h-[100px] bg-gray-200 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">?</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">{`${profile.first_name} ${profile.last_name} [${profile.user_role}]`}</h2>
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
