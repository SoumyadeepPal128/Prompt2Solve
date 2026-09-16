import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/Input.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(email, username, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text font-mono flex items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold mb-4">Register</h1>

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          autoFocus
        />
        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          disabled={loading}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        {error && <p className="text-error text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-accent text-bg px-4 py-2 rounded-lg font-bold disabled:opacity-50 w-full"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-muted text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-accent hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;