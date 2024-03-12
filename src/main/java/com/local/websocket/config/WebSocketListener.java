package com.local.websocket.config;

import com.local.websocket.model.ChatMessage;
import com.local.websocket.model.MessageType;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketListener {

    private final SimpMessageSendingOperations messageSendingOperations;

    public WebSocketListener(SimpMessageSendingOperations messageSendingOperations) {
        this.messageSendingOperations = messageSendingOperations;
    }

    @EventListener
    public void handleWebSocketDisconnectLister(SessionDisconnectEvent event) {
        StompHeaderAccessor stompHeaderAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sender = stompHeaderAccessor.getSessionAttributes().get("sender").toString();
        if (sender != null) {
            ChatMessage chatMessage = new ChatMessage("", sender, MessageType.LEAVE);
            System.out.println("USER LEAVE MSG SEND: " + chatMessage.toString());
            messageSendingOperations.convertAndSend("/topic/public", chatMessage);
        }
    }
}
