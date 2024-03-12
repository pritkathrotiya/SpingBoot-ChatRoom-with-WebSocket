package com.local.websocket.model;

import org.springframework.stereotype.Component;

@Component
public class ChatMessage {
    private String message;
    private String sender;
    private MessageType type;

    public ChatMessage(String message, String sender, MessageType type) {
        this.message = message;
        this.sender = sender;
        this.type = type;
    }

    public ChatMessage() {
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "ChatMessage{" +
                "message='" + message + '\'' +
                ", sender='" + sender + '\'' +
                ", type=" + type +
                '}';
    }
}
