package com.userImp.ImplementUser.Services;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface ExcelProcessingServices {
    List<Map<String, String>> processExcelFile(MultipartFile file) throws IOException;
    void validateExcelData(List<Map<String, String>> data);
}
