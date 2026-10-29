package io.stocksmart.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class AuthDto {

    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Valid email is required")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        public LoginRequest() {}
        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginResponse {
        private String token;
        private UserInfo user;

        public LoginResponse() {}
        public LoginResponse(String token, UserInfo user) {
            this.token = token;
            this.user = user;
        }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }

        public UserInfo getUser() { return user; }
        public void setUser(UserInfo user) { this.user = user; }
    }

    public static class UserInfo {
        private String id;
        private String email;
        private String name;
        private String role;
        private List<String> assignedLocationIds;

        public UserInfo() {}
        public UserInfo(String id, String email, String name, String role, List<String> assignedLocationIds) {
            this.id = id;
            this.email = email;
            this.name = name;
            this.role = role;
            this.assignedLocationIds = assignedLocationIds;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public List<String> getAssignedLocationIds() { return assignedLocationIds; }
        public void setAssignedLocationIds(List<String> assignedLocationIds) { this.assignedLocationIds = assignedLocationIds; }
    }
}
