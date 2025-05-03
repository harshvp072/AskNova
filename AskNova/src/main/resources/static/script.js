async function sendQuestion() {
    const input = document.getElementById('questionInput');
    const question = input.value.trim();
    if (!question) return;

    const container = document.getElementById('responseContainer');
    const thinkingContainer = document.getElementById('thinkingContainer');

    thinkingContainer.style.display = "flex";

    let answer = "";
    try {
        const res = await fetch("/api/qna/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question })
        });
        answer = await res.text();
    } catch (e) {
        answer = "Error fetching response.";
    }

    thinkingContainer.style.display = "none";

    // ✅ Clean and display the response after it's available
    const cleanedAnswer = answer.replace(/📋|🔗/g, '');
    const content = document.createElement('div');
    content.innerHTML = marked.parse(cleanedAnswer);

    const entry = document.createElement('div');
    entry.className = 'response-entry';

    const questionBox = document.createElement('div');
    questionBox.className = 'question-box';
    questionBox.textContent = `Q: ${question}`;

    const card = document.createElement('div');
    card.className = 'response-card';

    card.appendChild(content);
    entry.appendChild(questionBox);
    entry.appendChild(card);

    container.appendChild(entry);
    input.value = "";
}

document.getElementById('questionInput').addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendQuestion();
    }
});

document.querySelector(".btn").addEventListener("click", sendQuestion);