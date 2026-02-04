import { useState } from "react";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="h-screen flex justify-center items-center">
      <form className="flex flex-col w-[400px] max-w-[90%] gap-4">
        <input
          className="py-3 px-1 border-2 border-color rounded-md"
          type="text"
          placeholder="Email"
        />
        <input
          className="py-3 px-1 border-2 border-color rounded-md"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
        />
        <div className="self-end">
          <input
            className="mr-1"
            type="checkbox"
            id="show-password-toggle"
            onChange={() => setShowPassword(!showPassword)}
          />
          <label htmlFor="show-password-toggle">Show password</label>
        </div>
        <button className="p-3 mt-3 bg-green-500 text-white rounded-md">
          Login
        </button>
      </form>
    </main>
  );
}

export default LoginPage;
