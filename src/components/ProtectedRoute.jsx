import React from "react";
import { useState, useEffect } from "react";
import { Navigate } from "react-router";

function ProtectedRoute({ allowedRoles, children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    async function fetchProfile() {
      try {
        const response = await fetch("/api/me", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (response.ok) {
          setProfile(data.profile);
          return;
        }

        if (response.status === 401) {
          const refresh = await fetchRefresh();
          if (refresh.isRefreshed) return fetchProfile();

          //   setError(refresh.message || "Failed to load profile data");
        }
      } catch (error) {
        setError("Unable to connect to server");
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  if (!allowedRoles.includes(profile.user_role))
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="font-bold text-2xl">Forbidden</h1>
        <p className="text-sm">You are not authorized to access this page</p>
      </div>
    );
  if (!profile) return <Navigate to="/login" replace />;

  return React.cloneElement(children, { profile });
}

export default ProtectedRoute;
