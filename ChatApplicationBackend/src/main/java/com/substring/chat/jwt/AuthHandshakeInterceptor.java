package com.substring.chat.jwt;

import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import java.util.Map;


@Component
public class AuthHandshakeInterceptor implements HandshakeInterceptor {
	
	JwtUtil jwtUtil=new JwtUtil();

	@Override
	public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
			Map<String, Object> attributes) throws Exception {
		String token = (request.getURI().getQuery().split("token=")[1]).split("&")[0]; // Get token from query parameters
		System.out.println(token);
		if (token != null) {
			if (isValidToken(token)) { // Validate the token here
				attributes.put("user", extractUserFromToken(token)); // Add user info to attributes
				return true;
			}
		}
		response.setStatusCode(HttpStatus.UNAUTHORIZED);
		return false;
	}

	@Override
	public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
			Exception exception) {
		// No action needed after handshake
	}

	private boolean isValidToken(String token) {
		try {
			// Validate the token using JwtUtil
			return !jwtUtil.isTokenExpired(token);
		} catch (Exception e) {
			e.printStackTrace();
			return false; // Token is invalid if any exception occurs
		}
	}

	private String extractUserFromToken(String token) {
		try {
			return jwtUtil.getUsernameFromToken(token);
		} catch (Exception e) {
			e.printStackTrace();
			return null; // Return null if token is invalid or an error occurs
		}
	}
}
