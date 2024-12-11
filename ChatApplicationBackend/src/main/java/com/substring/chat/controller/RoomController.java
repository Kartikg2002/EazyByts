package com.substring.chat.controller;

import org.springframework.web.bind.annotation.RestController;
import com.substring.chat.model.Message;
import com.substring.chat.model.Room;
import com.substring.chat.service.RoomService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/room")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomController {

	@Autowired
	private RoomService roomService;
	
	//Create Room
	@PostMapping("/createRoom")
	public ResponseEntity<?> createRoom(@RequestBody String roomId) {
		Room room = roomService.findByRoomId(roomId);
		if(room != null) {
			return ResponseEntity.badRequest().body("Room Already Exist");
		}
		Room savedRoom = roomService.createRoom(roomId);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
	}
	
	@GetMapping("/findByRoomId/{roomId}")
	public Room findByRoomId(@PathVariable("roomId") String roomId) {
		return roomService.findByRoomId(roomId);
	}
	
	// join room
	@GetMapping("/joinRoom/{roomId}")
	public ResponseEntity<?> joinRoom(@PathVariable("roomId") String roomId) {
		Room room = roomService.findByRoomId(roomId);
		if( room == null) {
			return ResponseEntity.badRequest().body("Room Not Found");
		}
		return ResponseEntity.ok(room);
	}
	
	// get messages of room
	@GetMapping("/getMessages/{roomId}")
	public ResponseEntity<List<Message>> getMessages(@PathVariable("roomId") String roomId,
			@RequestParam(value="page", defaultValue="0", required=false) int page,
			@RequestParam(value="size", defaultValue="20", required=false) int size) {
		Room room = roomService.findByRoomId(roomId);
		if( room == null) {
			return ResponseEntity.badRequest().build();
		}
		//get messages
		List<Message> messages = room.getMessages();
		//pagination
		int start = Math.max(0,messages.size() - (page + 1) * size);
		int end = Math.min(messages.size(),start + size);
		List<Message> paginatedMessages = messages.subList(start,end);
		return ResponseEntity.ok(paginatedMessages);
	}

}
