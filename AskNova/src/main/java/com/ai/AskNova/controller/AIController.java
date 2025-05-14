package com.ai.AskNova.controller;

import com.ai.AskNova.service.QnAService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.*;

@RestController
@RequestMapping("/api/qna")
@AllArgsConstructor
public class AIController {

    private final QnAService qnAService;

    // ✅ Semaphore with 7 permits = 7 questions allowed per minute
    private final Semaphore rateLimiter = new Semaphore(7);

    // ✅ Scheduler to reset permits every 1 minute
    {
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
        scheduler.scheduleAtFixedRate(() -> {
            int permitsToAdd = 7 - rateLimiter.availablePermits();
            if (permitsToAdd > 0) {
                rateLimiter.release(permitsToAdd);
                System.out.println("🔁 Rate limit reset. 7 permits available.");
            }
        }, 1, 1, TimeUnit.MINUTES); // Reset every minute
    }

    @PostMapping("/ask")
    public ResponseEntity<String> askQuestions(@RequestBody Map<String, String> payLoad) {
        String question = payLoad.get("question");

        // ✅ Try to acquire 1 permit
        boolean allowed = rateLimiter.tryAcquire();

        if (!allowed) {
            // 🛑 If no permit is available, reject the request
            return ResponseEntity.status(429).body("❌ Rate limit exceeded. Please wait a minute.");
        }

        // ✅ Proceed normally if allowed
        String answer = qnAService.getAnswer(question);
        
        return ResponseEntity.ok(answer);
    }
}
