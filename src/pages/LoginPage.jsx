import { useState } from "react";
import { useNavigate } from "react-router";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function handleInput(event) {
    const newInput = event.target.value;
    const inputType = event.target.name;

    if (inputType === "email") {
      setInput((prev) => ({
        ...prev,
        email: newInput,
      }));
    } else if (inputType === "password") {
      setInput((prev) => ({
        ...prev,
        password: newInput,
      }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const email = input.email.trim();
      const password = input.password.trim();

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: "include",
      });

      const data = await response.json();
      const { message, role } = data;

      if (response.ok) {
        //if role exists, means user is already logged in
        if (role) {
          if (role === "admin")
            return navigate("/admin/dashboard", { replace: true });
          if (role === "librarian")
            return navigate("/librarian/dashboard", { replace: true });
          if (role === "student")
            return navigate("/student/homepage", { replace: true });
        }

        console.log(message);
        setLoading(false);
        sessionStorage.setItem("pendingEmail", email);
        return navigate("/login/verify-otp");
      }

      setLoading(false);
      return alert(message);
    } catch (error) {
      setLoading(false);
      console.error("Error logging in", error);
      alert("Unable to connect to the server");
    }
  }

  return (
    <main className="h-screen flex justify-center items-center">
      <form
        className="flex flex-col w-[400px] max-w-[90%] gap-4"
        onSubmit={handleSubmit}
      >
        <h1 className="self-center text-xl text-center mb-5 font-bold">
          LOGIN
        </h1>
        <input
          className="py-3 px-1 border-2 border-gray-200 rounded-md"
          name="email"
          type="text"
          placeholder="Email"
          value={input.email}
          onChange={handleInput}
          required
        />
        <input
          className="py-3 px-1 border-2 border-gray-200 rounded-md"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={input.password}
          onChange={handleInput}
          required
        />
        <div className="self-end">
          <input
            className="mr-1"
            type="checkbox"
            checked={showPassword}
            id="show-password-toggle"
            onChange={() => setShowPassword(!showPassword)}
          />
          <label htmlFor="show-password-toggle">Show password</label>
        </div>
        <button
          className={`p-3 mt-3 ${loading ? "bg-green-300" : "bg-green-500 hover:bg-green-400"} text-white rounded-md`}
          tabIndex={0}
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </main>
  );
}

export default LoginPage;
