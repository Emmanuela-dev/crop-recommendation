from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load your trained model
model = joblib.load("model/crop_model.pkl")

@app.route("/")
def home():
    return "API is running "

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    try:
        features = np.array([
            data["N"],
            data["P"],
            data["K"],
            data["temperature"],
            data["humidity"],
            data["ph"],
            data["rainfall"]
        ]).reshape(1, -1)

        prediction = model.predict(features)

        return jsonify({
            "recommended_crop": prediction[0]
        })

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)