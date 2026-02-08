import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";

function StudentHomePage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null);
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

        return response.ok;
      } catch (error) {
        return false;
      }
    }

    async function fetchProfile(retried = false) {
      try {
        const response = await fetch(API_URL + "/api/me", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (response.ok) {
          setProfile(data.profile);
          setLoading(false);
          return;
        }

        if (response.status === 401 && !retried) {
          //try refreshing session once
          const refreshed = await fetchRefresh();
          if (refreshed) return fetchProfile(true); //retry once

          setLoading(false);
          alert("Session expired. Please login in again");
          navigate("/login", { replace: true });
          return;
        }

        setLoading(false);
        setMessage(data.message);
        alert(data.message);
        return;
      } catch (error) {
        setLoading(false);
        setMessage(data.message);
        console.error("Error fetching user profile", error);
        alert("Unable to connect to the server");
      }
    }

    fetchProfile();
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
  if (!loading && !profile) return <div>{message}</div>;

  return (
    <>
      <nav className="flex items-center justify-between bg-green-500 px-4 py-5">
        <section className="font-bold text-lg text-white cursor-pointer">
          Mini HNU Library MS
        </section>
        <section>
          <ul className="flex gap-5 text-white">
            <li className="cursor-pointer">Home</li>
            <li className="cursor-pointer">Books</li>
            <li className="cursor-pointer">Borrowed</li>
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
        <section className="flex items-start gap-3">
          <div className="w-[100px] h-[100px] bg-gray-200 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">?</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">{`${profile.first_name} ${profile.last_name} [${profile.student_school_id}]`}</h2>
            <p className="text-sm">{profile.email}</p>
          </div>
        </section>
      </main>
    </>
  );
}

export default StudentHomePage;
