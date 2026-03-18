import requests

url = "http://127.0.0.1:5000/predict"

data = {
    "N": 90,
    "P": 40,
    "K": 40,
    "temperature": 25,
    "humidity": 80,
    "ph": 6.5,
    "rainfall": 200
}

response = requests.post(url, json=data)

print(response.json())