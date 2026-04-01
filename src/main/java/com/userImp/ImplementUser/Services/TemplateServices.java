package com.userImp.ImplementUser.Services;

import java.util.Map;

public interface TemplateServices {
    String processTemplate(String template, Map<String, String> data);
    String wrapInHtmlTemplate(String content, String templateName);
}
