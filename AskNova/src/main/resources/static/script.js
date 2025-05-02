async function sendQuestion() {
  const input = document.getElementById('questionInput');
  const question = input.value.trim();
  if (!question) return;

  const res = await fetch("/api/qna/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  let answer = "";

  try {
    answer = await res.text();
  } catch (e) {
    answer = "Error parsing the response.";
  }

  const container = document.getElementById('responseContainer');
  container.innerHTML = `
    <div class="response-card">
      <button class="copy-btn" onclick="copyAnswer()">Copy</button>
      <div id="answerText">${marked.parse(answer)}</div>
    </div>
  `;


  input.value = "";
}

// ✅ Move this function outside sendQuestion
function copyAnswer() {
  const text = document.getElementById('answerText').innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("Answer copied to clipboard!");
  }).catch(() => {
    alert("Failed to copy.");
  });
}
