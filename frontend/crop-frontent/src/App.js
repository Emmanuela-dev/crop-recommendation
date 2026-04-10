import { useState } from "react";
import "./App.css";

const FIELD_META = {
  N: { label: "Nitrogen (N)", unit: "ppm", min: 0, max: 140, placeholder: "e.g. 0", tip: "Range: 0-140 ppm" },
  P: { label: "Phosphorus (P)", unit: "ppm", min: 5, max: 145, placeholder: "e.g. 5", tip: "Range: 5-145 ppm" },
  K: { label: "Potassium (K)", unit: "ppm", min: 5, max: 205, placeholder: "e.g. 5", tip: "Range: 5-205 ppm" },
  temperature: { label: "Temperature", unit: "°C", min: 8, max: 44, placeholder: "e.g. 8", tip: "Range: 8-44 °C" },
  humidity: { label: "Humidity", unit: "%", min: 14, max: 100, placeholder: "e.g. 14", tip: "Range: 14-100 %" },
  ph: { label: "Soil pH", unit: "", min: 3.5, max: 9.5, placeholder: "e.g. 3.5", tip: "Range: 3.5-9.5" },
  rainfall: { label: "Rainfall", unit: "mm", min: 20, max: 300, placeholder: "e.g. 20", tip: "Range: 20-300 mm" },
};

const CROP_TIPS = {
  rice:        "Rice thrives in waterlogged fields. Ensure consistent irrigation and warm temperatures.",
  maize:       "Maize needs well-drained soil and full sunlight. Space plants 25–30 cm apart.",
  chickpea:    "Chickpea prefers cool, dry climates. Avoid waterlogging and use well-drained soil.",
  kidneybeans: "Kidney beans grow best in loamy soil with moderate moisture and warm temperatures.",
  pigeonpeas:  "Pigeon peas are drought-tolerant. Plant in well-drained soil with full sun exposure.",
  mothbeans:   "Moth beans are highly drought-resistant. Ideal for arid and semi-arid regions.",
  mungbean:    "Mung beans prefer warm weather and well-drained sandy loam soil.",
  blackgram:   "Black gram grows well in tropical climates with moderate rainfall.",
  lentil:      "Lentils prefer cool growing seasons and well-drained, loamy soil.",
  pomegranate: "Pomegranate thrives in hot, dry climates. Requires minimal water once established.",
  banana:      "Bananas need rich, well-drained soil, high humidity, and consistent watering.",
  mango:       "Mango trees prefer tropical climates with a distinct dry season for flowering.",
  grapes:      "Grapes need well-drained soil, full sun, and a dry summer climate.",
  watermelon:  "Watermelons need sandy loam soil, warm temperatures, and plenty of sunlight.",
  muskmelon:   "Muskmelons grow best in warm, dry climates with well-drained sandy soil.",
  apple:       "Apples require cold winters for dormancy and well-drained, fertile soil.",
  orange:      "Oranges thrive in subtropical climates with moderate rainfall and full sun.",
  papaya:      "Papaya grows fast in tropical climates. Needs well-drained soil and warm weather.",
  coconut:     "Coconut palms thrive in coastal tropical areas with high humidity and rainfall.",
  cotton:      "Cotton needs a long frost-free period, plenty of sunshine, and moderate rainfall.",
  jute:        "Jute grows best in warm, humid climates with loamy soil and heavy rainfall.",
  coffee:      "Coffee prefers high altitudes, rich soil, and a mild climate with regular rainfall.",
};

const INITIAL_FORM = { N: "", P: "", K: "", temperature: "", humidity: "", ph: "", rainfall: "" };

function App() {
  const [formData, setFormData]       = useState(INITIAL_FORM);
  const [result, setResult]           = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          Object.fromEntries(Object.entries(formData).map(([k, v]) => [k, Number(v)]))
        ),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data.recommended_crop);
    } catch (err) {
      setError(err.message || "Something went wrong. Make sure the Flask server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setResult(null);
    setError("");
  };

  const cropTip = result
    ? (CROP_TIPS[result.toLowerCase()] || "Follow local agricultural guidelines for best yield.")
    : "";

  return (
    <div className="container">
      <div className="header">
        <h1 className="title"> Smart Crop Recommendation</h1>
        <p className="subtitle">
          Enter your soil and climate data below. Our machine learning model will analyse the conditions and recommend the most suitable crop to grow.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="fields-grid">
          {Object.keys(INITIAL_FORM).map((key) => {
            const { label, unit, tip, min, max, placeholder } = FIELD_META[key];
            return (
              <div key={key} className="input-group">
                <label>
                  {label}{unit && <span className="unit"> ({unit})</span>}
                  <span className="tooltip" title={tip}> ⓘ</span>
                </label>
                <input
                  type="number"
                  name={key}
                  placeholder={placeholder}
                  value={formData[key]}
                  onChange={handleChange}
                  min={min}
                  max={max}
                  step="any"
                  required
                />
                <span className="range-hint">Range: {min} – {max}{unit ? ` ${unit}` : ""}</span>
              </div>
            );
          })}
        </div>

        <div className="btn-row">
          <button type="submit" className="predict-btn" disabled={loading}>
            {loading ? "Analysing..." : "🔍 Predict Crop"}
          </button>
          <button type="button" className="reset-btn" onClick={handleReset}>↺ Reset</button>
        </div>
      </form>

      {error && (
        <div className="error-box"><strong>Error:</strong> {error}</div>
      )}

      {result && (
        <div className="result">
          <h2>Recommended Crop: <span className="crop">{result.charAt(0).toUpperCase() + result.slice(1)}</span></h2>
          <p className="advice">{cropTip}</p>
          <div className="params-summary">
            <h3>Parameters Used</h3>
            <ul>
              {Object.entries(formData).map(([key, val]) => (
                <li key={key}>
                  <strong>{FIELD_META[key].label}:</strong> {val} {FIELD_META[key].unit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <footer className="footer">
        Powered by a Random Forest ML model trained on the Crop Recommendation Dataset.
      </footer>
    </div>
  );
}

export default App;
