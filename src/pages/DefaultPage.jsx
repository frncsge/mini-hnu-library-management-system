import { useNavigate } from "react-router";

function DefaultPage() {
  const navigate = useNavigate();

  return (
    <main className="h-screen flex flex-col items-center justify-center gap-5">
      <button
        className="w-[225px] p-2 bg-gray-300 rounded-md text-white"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
      <button
        className="w-[225px] p-2 bg-green-500 rounded-md text-white"
        onClick={() => navigate("/register")}
      >
        Register Student Account
      </button>
    </main>
  );
}

export default DefaultPage;
