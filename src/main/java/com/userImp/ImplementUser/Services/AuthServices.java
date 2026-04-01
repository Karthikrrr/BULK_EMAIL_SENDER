package com.userImp.ImplementUser.Services;

import com.userImp.ImplementUser.DTO.request.AuthRequest;
import com.userImp.ImplementUser.DTO.request.RegisterRequest;
import com.userImp.ImplementUser.DTO.response.AuthResponse;

public interface AuthServices {

    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse authenticate(AuthRequest authRequest);
}
