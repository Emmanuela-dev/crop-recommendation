#  Smart Crop Recommendation System

A full-stack machine learning web application that recommends the most suitable crop to grow based on soil nutrients and climate conditions.

---

##  What It Does

Farmers and agricultural planners can enter soil and weather parameters into the web interface. The app sends the data to a Flask API, which runs it through a trained Random Forest model and returns the best crop recommendation along with crop-specific growing tips.

---

##  How It Works

1. The user fills in 7 parameters: Nitrogen, Phosphorus, Potassium, Temperature, Humidity, Soil pH, and Rainfall.
2. The React frontend sends the data to the Flask backend via a POST request.
3. The backend loads a pre-trained Random Forest model and returns the predicted crop.
4. The frontend displays the recommended crop, a growing tip, and a summary of the parameters used.


##  Supported Crops

The model can recommend 22 crops including:

Rice, Maize, Chickpea, Kidney Beans, Pigeon Peas, Moth Beans, Mung Bean, Black Gram, Lentil, Pomegranate, Banana, Mango, Grapes, Watermelon, Muskmelon, Apple, Orange, Papaya, Coconut, Cotton, Jute, and Coffee.

---

##  Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React.js                          |
| Backend   | Python, Flask, Flask-CORS         |
| ML Model  | scikit-learn (Random Forest)      |
| Data      | Crop Recommendation Dataset       |

