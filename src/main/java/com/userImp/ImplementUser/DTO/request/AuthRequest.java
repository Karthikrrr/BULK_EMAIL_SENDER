package com.userImp.ImplementUser.DTO.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;


@Builder
public class AuthRequest {

    @NotBlank(message = "Email is Requried")
    @Email(message = "Email is Not Valid")
    private String email;

    @NotBlank(message = "Password is Requried")
    @Size(min = 6, max = 14, message = "Enter A Valid Password")
    private String password;

    public AuthRequest(@NotBlank(message = "Email is Requried") @Email(message = "Email is Not Valid") String email,
            @NotBlank(message = "Password is Requried") @Size(min = 6, max = 14, message = "Enter A Valid Password") String password) {
        this.email = email;
        this.password = password;
    }

    public AuthRequest() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
