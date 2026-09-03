import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Textarea from "../components/TextArea.jsx";
import { generateProblem } from "../api/problem.js";

const LOADING_MESSAGES = [
  "Priming job...",
  "Executing job runtime=cpp-10.2.0...",
  "Cleaning up job...",
];

function GeneratePage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[i]);
    }, 2000);

    try {
      const problem = await generateProblem(prompt);
      navigate(`/solve/${problem._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      clearInterval(interval);
      setLoading(false);
      setLoadingMessage(LOADING_MESSAGES[0]);
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text font-mono flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <p className="text-muted mb-2">$ describe a problem to generate</p>

        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="the two sum problem"
            disabled={loading}
            autoFocus
            rows={1}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="bg-accent text-bg px-4 py-2 rounded-lg font-bold disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? "..." : "Generate"}
          </button>
        </form>

        {loading && <p className="text-muted mt-4 text-sm">{loadingMessage}</p>}

        {error && <p className="text-error mt-4 text-sm">Error: {error}</p>}
      </div>
    </div>
  );
}

export default GeneratePage;