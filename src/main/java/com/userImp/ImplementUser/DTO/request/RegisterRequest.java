package com.userImp.ImplementUser.DTO.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Email is Requried")
    @Email(message = "Email is Not Valid")
    private String email;

    @NotBlank(message = "Password is Requried")
    @Size(min = 6, max = 14, message = "Enter A Valid Password")
    private String password;

    @NotBlank(message = "FirstName is Requried")
    private String firstName;

    @NotBlank(message = "LastName is Requried")
    private String lastName;

    public RegisterRequest(@NotBlank(message = "Email is Requried") @Email(message = "Email is Not Valid") String email,
            @NotBlank(message = "Password is Requried") @Size(min = 6, max = 14, message = "Enter A Valid Password") String password,
            @NotBlank(message = "FirstName is Requried") String firstName,
            @NotBlank(message = "LastName is Requried") String lastName) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public RegisterRequest() {
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

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

}
