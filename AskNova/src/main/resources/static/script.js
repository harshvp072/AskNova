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
    <div class="response-card">${answer}</div>
  `;

  input.value = "";
}
