from flask import Flask, request, jsonify
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
model = joblib.load("models/email_auth_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    domain = data.get("domain", "")
    subject = data.get("subject", "")
    body = data.get("body", "")
    text = f"{domain} {subject} {body}"
    pred = model.predict([text])[0]
    prob = model.predict_proba([text])[0][pred]
    return jsonify({
        "prediction": int(pred),
        "label": "Authorized" if pred == 1 else "Unauthorized",
        "confidence": round(prob, 4)
    })

if __name__ == "__main__":
    app.run(debug=True)
