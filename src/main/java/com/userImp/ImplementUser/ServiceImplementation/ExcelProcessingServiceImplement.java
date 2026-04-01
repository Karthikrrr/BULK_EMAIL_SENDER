package com.userImp.ImplementUser.ServiceImplementation;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.userImp.ImplementUser.Services.ExcelProcessingServices;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ExcelProcessingServiceImplement implements ExcelProcessingServices {

    @Override
   public List<Map<String, String>> processExcelFile(MultipartFile file) throws IOException {
        List<Map<String, String>> data = new ArrayList<>();
        
        log.info("Processing Excel file: {}, size: {}", file.getOriginalFilename(), file.getSize());
        
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            if (sheet == null) {
                throw new IOException("Excel file contains no sheets");
            }
            
            Row headerRow = sheet.getRow(0);
            if (headerRow == null) {
                throw new IOException("Excel file contains no header row");
            }
            
            List<String> columnNames = new ArrayList<>();
            for (Cell cell : headerRow) {
                columnNames.add(cell.getStringCellValue().trim());
            }
            
            log.info("Found columns: {}", columnNames);
            
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row != null) {
                    Map<String, String> rowData = new HashMap<>();
                    for (int j = 0; j < columnNames.size(); j++) {
                        Cell cell = row.getCell(j);
                        String value = cell != null ? getCellValueAsString(cell) : "";
                        rowData.put(columnNames.get(j), value.trim());
                    }
                    data.add(rowData);
                }
            }
            
            log.info("Processed {} data rows", data.size());
        }
        
        return data;
    }

    private String getCellValueAsString(Cell cell) {
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    return String.valueOf(cell.getNumericCellValue());
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return "";
        }
    }

    @Override
    public void validateExcelData(List<Map<String, String>> data) {
        if (data.isEmpty()) {
            throw new RuntimeException("Excel file contains no data");
        }

        for (int i = 0; i < data.size(); i++) {
            Map<String, String> row = data.get(i);
            if (!row.containsKey("email") || row.get("email").isEmpty()) {
                throw new RuntimeException("Row " + (i + 2) + ": Email field is required");
            }
            String email = row.get("email");
            if (!isValidEmail(email)) {
                throw new RuntimeException("Row " + (i + 2) + ": Invalid email format - " + email);
            }
        }
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        return email.matches(emailRegex);
    }
}
