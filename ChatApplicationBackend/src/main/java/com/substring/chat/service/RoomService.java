package com.substring.chat.service;

import com.substring.chat.model.Room;

public interface RoomService {
	public Room createRoom(String roomId);
	public Room findByRoomId(String roomId) ;
	public void save(Room room);
}
