// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className={`neumorphic ${user ? 'golden-sand-theme' : 'goldenrod-theme'} p-10 flex flex-col items-center max-w-lg w-full`}>
        <h1 className="text-4xl font-bold mb-8 text-gray-700 text-center">
          Welcome to MindShelf
        </h1>

        {!user ? (
          <div className="flex space-x-6">
            <Link
              to="/login"
              className="neumorphic-btn px-8 py-3 text-blue-500 hover:text-blue-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="neumorphic-btn px-8 py-3 text-gray-500 hover:text-gray-600"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6 w-full">
            <p className="text-xl text-gray-600">Hello, <span className="font-bold text-gray-800">{user.name}</span> 👋</p>
            <Link
              to="/notes"
              className="neumorphic-btn px-8 py-3 text-green-600 w-full text-center"
            >
              Go to Notes
            </Link>
            <button
              onClick={logout}
              className="neumorphic-btn px-8 py-3 text-red-500 w-full"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
