package com.ai.AskNova.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class QnAService {

    // Inject the Gemini API base URL from application.properties or .env
    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    // Inject the Gemini API key from configuration
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    // Declare a WebClient instance for making HTTP requests
    private final WebClient webClient;

    // Constructor-based injection of a WebClient.Builder
    public QnAService(WebClient.Builder webClient) {
        this.webClient = webClient.build(); // Build and assign the WebClient instance
    }

    // Public method to fetch the AI-generated answer based on the input question
    public String getAnswer(String question) {
        // Construct the request body as a nested JSON-like map structure
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", question) // The user's question goes into the "text" field
                        })
                }
        );

        // Send the HTTP POST request using WebClient
        String response = webClient.post()
                .uri(geminiApiUrl + geminiApiKey) // Append API key to the URL (consider separating if needed)
                .header("Content-Type", "application/json") // Set the content type to JSON
                .bodyValue(requestBody) // Attach the constructed request body
                .retrieve() // Trigger the HTTP request
                .bodyToMono(String.class) // Convert the response body into a reactive Mono<String>
                .block(); // Block the current thread to get the result synchronously

        // Try to extract the response text from the JSON structure
        try {
            ObjectMapper mapper = new ObjectMapper(); // Create a JSON parser
            JsonNode root = mapper.readTree(response); // Parse the response string into a JSON tree

            // Navigate through the JSON tree to extract the answer text
            return root.path("candidates") // Access the "candidates" array
                    .get(0) // Get the first element of the array
                    .path("content") // Access the "content" object inside it
                    .path("parts") // Navigate to the "parts" array
                    .get(0) // Get the first part
                    .path("text") // Access the actual text
                    .asText(); // Return it as a plain string

        } catch (Exception e) {
            e.printStackTrace(); // Print error details if parsing fails
            return "Error parsing response from AI."; // Return fallback error message
        }
    }
}