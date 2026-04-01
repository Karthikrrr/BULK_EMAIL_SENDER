package com.userImp.ImplementUser.ServiceImplementation;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.userImp.ImplementUser.Services.TemplateServices;

@Service
public class TemplateServiceImplement implements TemplateServices {

    @Override
    public String processTemplate(String template, Map<String, String> data) {
        String processedTemplate = template;
        
        // Replace placeholders with actual data
        for (Map.Entry<String, String> entry : data.entrySet()) {
            String placeholder = "{" + entry.getKey() + "}";
            processedTemplate = processedTemplate.replace(placeholder, 
                entry.getValue() != null ? entry.getValue() : "");
        }
        
        return processedTemplate;
    }

    @Override
    public String wrapInHtmlTemplate(String content, String templateName) {
      return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
                    .content { padding: 30px; background-color: #ffffff; }
                    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="content">
                        %s
                    </div>
                </div>
            </body>
            </html>
            """.formatted(content);
    }

}
