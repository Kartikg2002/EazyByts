package com.substring.chat.controller;

import com.substring.chat.model.Message;
import com.substring.chat.model.Room;
import com.substring.chat.payload.MessageRequest;
import com.substring.chat.service.RoomService;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import jakarta.transaction.Transactional;


@Controller
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

	@Autowired
	private RoomService roomService;
	
	@MessageMapping("/sendMessage/{roomId}")// /chat/sendMessage/roomId
	@SendTo("/topic/room/{roomId}")// subscribe
	@Transactional
	public Message sendMessage(@DestinationVariable String roomId, @RequestBody MessageRequest request) {
		
		Room room = roomService.findByRoomId(request.getRoomId());
		
		Message message = new Message();
		message.setContent(request.getContent());
		message.setSender(request.getSender());
		message.setRoom(room);
		message.setTimestamp(LocalDateTime.now());
		
		if(room!=null) {
			room.getMessages().add(message);
			roomService.save(room);
		}else {
			throw new RuntimeException("room not found");
		}
		return message;
	}
}
