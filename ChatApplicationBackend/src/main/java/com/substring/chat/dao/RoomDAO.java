package com.substring.chat.dao;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import com.substring.chat.model.Room;
import jakarta.persistence.EntityManager;
import java.util.UUID;

@Repository
public class RoomDAO {
	@Autowired
	private EntityManager entityManager;

	public Room createRoom(String roomId) {
		Session session = entityManager.unwrap(Session.class);
		Room room = new Room();
		room.setId(UUID.randomUUID().toString());
		room.setRoomId(roomId);
		session.persist(room);
		return room;
	}

	public Room findByRoomId(String roomId) {
		Session session = entityManager.unwrap(Session.class);
		Room room;
		try {
			 room = session.createQuery("select r from Room r where r.roomId = :roomId", Room.class)
					.setParameter("roomId", roomId).getSingleResult();
		} catch (Exception e) {
			return null;
		}
		return room;
	}
	
	public void save(Room room) {
		Session session = entityManager.unwrap(Session.class);
		session.persist(room);
	}

}
