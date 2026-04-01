package com.userImp.ImplementUser.Services;

public interface GeminiServices {

    String generateEmailTemplate(String prompt);

    String improveEmailTemplate(String existingTemplate, String improvementPrompt);

}
