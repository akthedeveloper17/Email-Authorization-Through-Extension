console.log("✅ Gmail Email Auth Scanner content script loaded");

function createScanButton() {
  const old = document.getElementById("email-auth-scan-btn");
  if (old) old.remove();

  const btn = document.createElement("button");
  btn.id = "email-auth-scan-btn";
  btn.innerText = "Scan Email";
  Object.assign(btn.style, {
    position: "fixed",
    top: "100px",
    right: "20px",
    zIndex: 9999,
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    cursor: "pointer",
    fontWeight: "bold"
  });
  btn.onclick = scanEmail;
  document.body.appendChild(btn);
}

function scanEmail() {
  const subjectElem = document.querySelector("h2.hP");
  const fromElem = document.querySelector(".gD");
  const bodyElem = document.querySelector("div.a3s");

  if (!subjectElem || !fromElem || !bodyElem) {
    alert("❌ Could not extract email. Open a full message.");
    return;
  }

  const subject = subjectElem.innerText;
  const sender = fromElem.getAttribute("email") || fromElem.innerText;
  const domain = sender.includes("@") ? sender.split("@")[1] : sender;
  const body = bodyElem.innerText;

  console.log("📤 Sending:", { domain, subject, body });

  fetch("http://localhost:5000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain, subject, body })
  })
  .then(res => res.json())
  .then(data => {
    console.log("✅ Prediction:", data);
    alert(`🧠 Prediction: ${data.label}\n📊 Confidence: ${(data.confidence * 100).toFixed(2)}%`);
  })
  .catch(err => {
    console.error("❌ Fetch error:", err);
    alert("❌ Failed to connect to backend.");
  });
}

const checkDOM = setInterval(() => {
  if (document.querySelector("h2.hP") && document.querySelector(".gD") && document.querySelector("div.a3s")) {
    createScanButton();
    clearInterval(checkDOM);
  }
}, 1000);
