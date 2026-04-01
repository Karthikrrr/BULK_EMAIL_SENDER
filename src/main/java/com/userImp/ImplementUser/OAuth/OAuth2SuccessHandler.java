package com.userImp.ImplementUser.OAuth;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.userImp.ImplementUser.Entity.User;
import com.userImp.ImplementUser.JWTHandler.JwtUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;

    public OAuth2SuccessHandler(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        CustomOAuth2User oauth = (CustomOAuth2User) authentication.getPrincipal();
        User user = oauth.getUser();

        String token = jwtUtil.generateToken(
                org.springframework.security.core.userdetails.User.withUsername(user.getEmail()).password("")
                        .authorities(user.getRole().name()).build());

        String redirectUrl = "http://localhost:3000/oauth2/success?token=" + token +
                "&email=" + URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8) +
                "&name=" + URLEncoder.encode(user.getFirstName(), StandardCharsets.UTF_8);
        response.sendRedirect(redirectUrl);

    }

}
