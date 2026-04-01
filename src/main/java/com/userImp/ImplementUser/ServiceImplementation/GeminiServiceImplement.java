package com.userImp.ImplementUser.ServiceImplementation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.userImp.ImplementUser.Services.GeminiServices;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture; 
import java.util.concurrent.TimeUnit; 

@Service
@Slf4j
public class GeminiServiceImplement implements GeminiServices {

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String MODEL = "gemini-2.5-flash";


    private final HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();


    public String generateEmailTemplate(String prompt) {
        String fullPrompt = "Create a professional HTML email template. " +
                "The template should be responsive and modern with inline CSS. " +
                "Include placeholders like {name}, {email} in curly braces for dynamic content. " +
                "Make it visually appealing with proper spacing and colors. " +
                "Provide only the HTML code without any explanations, markdown, or backticks. " +
                "User request: " + prompt;

        return callGemini(fullPrompt);
    }

    public String improveEmailTemplate(String existingTemplate, String improvementPrompt) {
        String fullPrompt = "Improve this HTML email template. " +
                "Existing template: " + existingTemplate +
                " Improvement instructions: " + improvementPrompt +
                " Provide only the improved HTML code without any explanations, markdown, or backticks.";

        return callGemini(fullPrompt);
    }



    private String callGemini(String prompt) {
        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                    + MODEL + ":generateContent?key=" + apiKey;

          
           
            ObjectMapper jsonMapper = new ObjectMapper();

            Map<String, Object> part = Map.of("text", prompt);
            Map<String, Object> content = Map.of("parts", List.of(part));
            Map<String, Object> requestMap = Map.of("contents", List.of(content));

            String requestBody = jsonMapper.writeValueAsString(requestMap);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            CompletableFuture<HttpResponse<String>> futureResponse = client.sendAsync(request,
                    HttpResponse.BodyHandlers.ofString());

            HttpResponse<String> response = futureResponse.get(60, TimeUnit.SECONDS);

            if (response.statusCode() != 200) {
                log.error("Gemini API call failed. Status: {} - Body: {}", response.statusCode(), response.body());
                throw new RuntimeException("Gemini API returned status: " + response.statusCode());
            }


            // Use the same mapper for parsing
            Map<String, Object> responseMap = jsonMapper.readValue(response.body(), Map.class);

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseMap.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                // Handle cases where the model might be blocked
                String finishReason = (String) ((Map<String, Object>) responseMap.get("promptFeedback"))
                        .get("blockReason");
                log.warn("Gemini API call was blocked. Reason: {}", finishReason);
                return "Error: Request blocked or no content generated.";
            }

            // Original parsing logic remains, but now handles null candidates
            Map<String, Object> candidate = candidates.get(0);
            content = (Map<String, Object>) candidate.get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            String text = (String) parts.get(0).get("text");

            return cleanGeminiResponse(text);

        } catch (InterruptedException e) {
            // 💡 Handle interruption during thread wait
            Thread.currentThread().interrupt();
            log.error("Gemini API call interrupted: {}", e.getMessage());
            throw new RuntimeException("Template generation interrupted.");
        } catch (java.util.concurrent.TimeoutException e) {
            // 💡 Handle the 60-second timeout
            log.error("Gemini API call timed out: {}", e.getMessage());
            throw new RuntimeException("Template generation timed out after 60 seconds.");
        } catch (Exception e) {
            log.error("Gemini API call failed: {}", e.getMessage());
            throw new RuntimeException("Failed to generate template: " + e.getMessage());
        }
    }

    private String cleanGeminiResponse(String text) {
        // Keep this as is, it's good for stripping markdown
        return text.replaceAll("```html", "")
                .replaceAll("```", "")
                .trim();
    }
}