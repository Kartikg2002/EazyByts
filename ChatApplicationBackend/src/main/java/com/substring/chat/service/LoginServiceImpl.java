package com.substring.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.substring.chat.dao.LoginDAO;
import com.substring.chat.model.Login;
import jakarta.transaction.Transactional;

@Service
public class LoginServiceImpl implements LoginService {
	
	@Autowired
	LoginDAO loginDAO;
	
	@Transactional
	@Override
	public Boolean save(Login room) {
		return loginDAO.save(room);
	}
	
}
