import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/analyze")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend request failed");
        }
        return response.json();
      })
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return (
    <div>
      <h1>ARGUS AI</h1>
      <p>Unified Security Intelligence Platform</p>

      <h2>Live Threat Analysis</h2>

      {error && <p>Error: {error}</p>}

      {!data && !error && <p>Loading threat analysis...</p>}

      {data && (
        <div>
          <h3>Risk Score: {data.risk_score}</h3>
          <h3>Risk Level: {data.risk_level}</h3>

          <h3>Detected Signals</h3>

          {data.detected_signals.map((signal, index) => (
            <p key={index}>• {signal}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;