import { useState } from "react";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

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

  function handleSubmit(event) {
    event.preventDefault();
    console.log(`${input.email} and ${input.password}`);
  }

  return (
    <main className="h-screen flex justify-center items-center">
      <form
        className="flex flex-col w-[400px] max-w-[90%] gap-4"
        onSubmit={handleSubmit}
      >
        <input
          className="py-3 px-1 border-2 border-gray-200 rounded-md"
          name="email"
          type="text"
          placeholder="Email"
          value={input.email}
          onChange={handleInput}
        />
        <input
          className="py-3 px-1 border-2 border-gray-200 rounded-md"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={input.password}
          onChange={handleInput}
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
        <button className="p-3 mt-3 bg-green-500 text-white rounded-md" tabIndex={0}>
          Login
        </button>
      </form>
    </main>
  );
}

export default LoginPage;
