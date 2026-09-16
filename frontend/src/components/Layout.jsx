import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Layout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="h-screen bg-bg text-text font-mono flex flex-col">
      <nav className="flex items-center justify-between border-b border-muted px-6 py-3">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-accent font-bold">
            Prompt2Solve
          </Link>
          <Link to="/problems" className="text-muted hover:text-text text-sm">
            Problems
          </Link>
        </div>

        {!loading && (
          user ? (
            <div className="flex items-center gap-3">
              <span className="text-muted text-sm">{user.username}</span>
              <button
                onClick={handleLogout}
                className="text-muted hover:text-text text-sm"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-accent text-sm hover:underline">
              Log in
            </Link>
          )
        )}
      </nav>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;