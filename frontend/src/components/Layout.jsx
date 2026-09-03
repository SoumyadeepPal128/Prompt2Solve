import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="h-screen bg-bg text-text font-mono flex flex-col">
      <nav className="flex items-center justify-between border-b border-muted px-6 py-3">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-accent font-bold">
            ai-leetcode
          </Link>
          <Link to="/problems" className="text-muted hover:text-text text-sm">
            Problems
          </Link>
        </div>

        <button
          className="w-8 h-8 rounded-full bg-black/40 border border-muted flex items-center justify-center text-muted hover:text-text text-sm"
          title="Account (coming soon)"
        >
          A
        </button>
      </nav>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;