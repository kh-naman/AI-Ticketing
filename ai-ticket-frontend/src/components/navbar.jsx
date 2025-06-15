import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  let user = null;
const userStr = localStorage.getItem("user");
if (userStr && userStr !== "undefined") {
  try {
    user = JSON.parse(userStr);
  } catch {
    user = null; // fallback if parsing fails
  }
}
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Ticket AI
        </Link>
      </div>
      <div className="flex gap-2">
        {!token ? (
          <>
            <Link to="/signup" className="btn btn-sm">
              Signup
            </Link>
            <Link to="/login" className="btn btn-sm">
              Login
            </Link>
          </>
        ) : (
          <>
            <p>Hi, {user?.email}</p>
            {user && user?.role === "admin" ? (
              <Link to="/admin" className="btn btn-sm">
                Admin
              </Link>
            ) : null}
            <button onClick={logout} className="btn btn-sm">
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}