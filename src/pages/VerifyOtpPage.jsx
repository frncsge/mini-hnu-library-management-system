import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

function VerifyOTP() {
  const [email] = useState(() => sessionStorage.getItem("pendingEmail"));
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    }
  }, [email, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_URL + "/login/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      const { message, role } = data;

      if (response.ok) {
        setLoading(false);
        sessionStorage.removeItem("pendingEmail");
        
        if (role === "admin")
          return navigate("/admin/dashboard", { replace: true });

        if (role === "librarian")
          return navigate("/librarian/dashboard", { replace: true });

        if (role === "student")
          return navigate("/student/homepage", { replace: true });
      }

      setLoading(false);
      return alert(message);
    } catch (error) {
      setLoading(false);
      console.error("Error verifying OTP", error);
      alert("Unable to connect to the server");
    }
  }

  async function handleResend() {
    setResending(true);

    try {
      const response = await fetch(API_URL + "/login/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      const data = await response.json();
      const { message } = data;

      setResending(false);
      return alert(message);
    } catch (error) {
      setResending(false);
      console.error("Error resending OTP", error);
      alert("Unable to connect to the server");
    }
  }

  return (
    <main className="h-screen flex items-center justify-center">
      <form
        className="flex flex-col items-center w-[400px] max-w-[90%] gap-7"
        onSubmit={handleSubmit}
      >
        <h1 className="text-xl">
          <b>Enter One-Time-Password</b>
        </h1>
        <p className="text-sm text-center">
          We have sent your OTP to <br />{" "}
          <b className="text-green-500">amoncio.francis_ge@hnu.edu.ph</b>
        </p>
        <input
          className="py-3 px-1 border-2 border-gray-200 rounded-md text-center"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength="6"
          size={6}
          autoFocus
          onChange={(e) => setOtp(e.target.value)}
          value={otp}
        />
        <button
          className={`p-3 mt-3 w-[120px] ${loading ? "bg-green-300" : "bg-green-500 hover:bg-green-400"} text-white rounded-md`}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
        <p className="text-sm">
          Did not receive OTP?{" "}
          <span
            className="underline cursor-pointer text-indigo-500 hover:text-indigo-400"
            onClick={handleResend}
          >
            Resend
          </span>
        </p>
      </form>
    </main>
  );
}

export default VerifyOTP;
