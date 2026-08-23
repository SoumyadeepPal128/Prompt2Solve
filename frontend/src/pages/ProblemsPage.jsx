import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllProblems } from "../api/problem.js";

function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllProblems()
      .then(setProblems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-8 text-muted font-mono">Loading problems...</p>;
  }

  if (error) {
    return <p className="p-8 text-error font-mono">Error: {error}</p>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-6">Problems</h1>

      {problems.length === 0 ? (
        <p className="text-muted">No problems generated yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {problems.map((p) => (
            <Link
              key={p._id}
              to={`/solve/${p._id}`}
              className="border border-muted rounded-lg px-4 py-3 hover:border-accent transition-colors"
            >
              <p className="font-bold">{p.title}</p>
              <p className="text-muted text-sm mt-1">
                {new Date(p.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProblemsPage;