package com.substring.chat.model;

import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Message {
    
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // Use a unique ID for the Message
    private String sender;
    private String content;
    private LocalDateTime timestamp;
    @ManyToOne
    @JsonIgnore
    private Room room;

    public Message() {
        // Default constructor for JPA
    }

    public Message(int id, String sender, String content, Room room) {
        this.id = id;
        this.sender = sender;
        this.content = content;
        this.room = room;
        this.timestamp = LocalDateTime.now();
    }
    
    public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getSender() {
		return sender;
	}

	public void setSender(String sender) {
		this.sender = sender;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}

	public Room getRoom() {
		return room;
	}

	public void setRoom(Room room) {
		this.room = room;
	}

	@Override
    public String toString() {
        return "Message [ sender=" + sender + ", content=" + content + ", timestamp=" + timestamp + "]";
    }
}
