async function sendQuestion() {
    const input = document.getElementById('questionInput');
    const question = input.value.trim();
    if (!question) return;

    const container = document.getElementById('responseContainer');
    const thinkingContainer = document.getElementById('thinkingContainer');

    // Show animation while processing
    thinkingContainer.style.display = "flex";

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

    // Hide animation once answer is received
    thinkingContainer.style.display = "none";

    // Create a response entry (question + answer)
    const entry = document.createElement('div');
    entry.className = 'response-entry';

    const questionBox = document.createElement('div');
    questionBox.className = 'question-box';
    questionBox.textContent = `Q: ${question}`;

    const card = document.createElement('div');
    card.className = 'response-card';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16" height="16" viewBox="0 0 16 16">
            <path d="M10 1.5v1a.5.5 0 0 0 .5.5h1A1.5 1.5 0 0 1 13 4v9a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 13V4a1.5 1.5 0 0 1 1.5-1.5h1a.5.5 0 0 0 .5-.5v-1h4zm-1 1h-2v1h2V2.5z"/>
            <path d="M3 4v9a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V4h-1a1.5 1.5 0 0 1-1.5-1.5h-2A1.5 1.5 0 0 1 5 4H3z"/>
        </svg>
    `;

    const content = document.createElement('div');
    content.innerHTML = marked.parse(answer);

    card.appendChild(copyBtn);
    card.appendChild(content);

    // Add question box and response to the entry
    entry.appendChild(questionBox);
    entry.appendChild(card);

    // Append the entry to the response container
    container.appendChild(entry);

    input.value = ""; // Clear the input box

    // Enable copy functionality
    addCopyFunctionality(copyBtn, content);
}


// Enable Enter key submission **(Only One Event Listener)**
document.getElementById('questionInput').addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent duplicate calls
        sendQuestion();
    }
});

// Attach function to the search button
document.querySelector(".btn").addEventListener("click", sendQuestion);
