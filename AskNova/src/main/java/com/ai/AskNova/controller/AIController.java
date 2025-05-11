package com.ai.AskNova.controller;

import com.ai.AskNova.service.QnAService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/qna")
@AllArgsConstructor
public class AIController {

    private final QnAService qnAService;

    @PostMapping("/ask")
    public ResponseEntity<String> askQuestions(@RequestBody Map<String,String> payLoad){
        String question = payLoad.get("question");
        String answer = qnAService.getAnswer(question);
        
        return ResponseEntity.ok(answer);
    }
}
