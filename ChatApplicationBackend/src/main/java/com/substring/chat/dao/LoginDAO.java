package com.substring.chat.dao;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import com.substring.chat.model.Login;
import jakarta.persistence.EntityManager;

@Repository
public class LoginDAO {

	@Autowired
	private EntityManager entityManager;

	public Boolean save(Login loginData) {
		Session session = entityManager.unwrap(Session.class);
		session.persist(loginData);
		return true;
	}
	
	public Login getByUsername(String username) {
		Session session = entityManager.unwrap(Session.class);
		Login loginData = session.get(Login.class, username);
		return loginData;
	}
	
}
