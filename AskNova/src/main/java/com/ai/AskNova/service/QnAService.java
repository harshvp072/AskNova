package com.ai.AskNova.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class QnAService {

    // Access to APIKey and URL[Gemini]
    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    @Value("${gemini.api.key}")
    private String geminiApiKey;


    public String getAnswer(String question) {
        // Construct the request payload

        // Make API call

        // Return response
        return  "";
    }
}
