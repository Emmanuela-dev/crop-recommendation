import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

# Load dataset
df = pd.read_csv("C:/Users/Emmanuela/Desktop/soen380/crops/crop.csv")

# Features and target
X = df.drop("label", axis=1)
y = df["label"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

#  CREATE MODEL FIRST
model = RandomForestClassifier(n_estimators=100)

# Train model
model.fit(X_train, y_train)

# Save model
joblib.dump(model, "model/crop_model.pkl")

print("Model trained and saved successfully!")