package com.userImp.ImplementUser.ServiceImplementation;

import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.userImp.ImplementUser.Entity.Role;
import com.userImp.ImplementUser.Entity.User;
import com.userImp.ImplementUser.JWTHandler.JwtUtil;
import com.userImp.ImplementUser.OAuth.CustomOAuth2User;
import com.userImp.ImplementUser.Repository.UserRepository;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public CustomOAuth2UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException{
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId();
        String providerId = oAuth2User.getAttribute("sub");
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        User user = userRepository.findByEmail(email).orElseGet(
            () -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setFirstName(name);
                newUser.setLastName("");
                newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                newUser.setRole(Role.ROLE_USER);
                newUser.setEnabled(true);
                return userRepository.save(newUser);
            }
        );

        return new CustomOAuth2User(oAuth2User, user);
    }

}
