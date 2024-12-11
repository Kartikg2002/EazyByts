package com.substring.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.substring.chat.dao.RoomDAO;
import com.substring.chat.model.Room;
import jakarta.transaction.Transactional;

@Service
public class RoomServiceImpl implements RoomService {
	
	@Autowired
	RoomDAO roomDAO;
	
	@Transactional
	@Override
	public Room createRoom(String roomId) {
		return roomDAO.createRoom(roomId);
	}
	
	@Override
	public Room findByRoomId(String roomId) {
		return roomDAO.findByRoomId(roomId);
	}
	
	@Transactional
	@Override
	public void save(Room room) {
		roomDAO.save(room);
	}
	
}
