package com.userImp.ImplementUser.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.userImp.ImplementUser.DTO.request.RegisterRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.validation.Valid;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/test")
public class TestController {

    private static final Logger logger = LoggerFactory.getLogger(TestController.class);

    @PostMapping("/myform")
    public ResponseEntity<String> getForm(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            logger.info(registerRequest.getEmail() + "\n Name : " + registerRequest.getFirstName() + " "
                    + registerRequest.getLastName() + "\nPassword : " + registerRequest.getPassword());
            return ResponseEntity.ok().body("Success Full Getting Form");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Got Some Error : " + e);
        }
    }

    @GetMapping("/products/string")
    public String getProductsAsString() {
        return """
                [
                  {"id":1,"name":"Wireless Mouse","price":499,"description":"Ergonomic wireless mouse","image":"https://via.placeholder.com/150"},
                  {"id":2,"name":"Mechanical Keyboard","price":1999,"description":"RGB keyboard","image":"https://via.placeholder.com/150"},
                  {"id":3,"name":"LG Keyboard","price":2999,"description":"7GB keyboard","image":"https://via.placeholder.com/150"}
                ]
                """;
    }

}
