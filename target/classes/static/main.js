var socketName = 'privateSocket';
var socketPath = '/topic/public';
var controller_addUser = "/app/chat.addUser";
var controller_sendMessage = "/app/chat.sendMessage";

var usernamePage = document.querySelector("#usernamePage");
var messagePage = document.querySelector("#messagePage");
var usernameForm = document.querySelector("#usernameForm");
var messageForm = document.querySelector("#messageForm");
var messageArea = document.querySelector("#messageArea");

var stompClient = null;
var sender = null;
var colors = ["#0d6efd", "#6610f2", "#6f42c1", "#d63384", "#dc3545", "#fd7e14", "#ffc107", "#198754", "#20c997", "#0dcaf0"];

usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);

function connect(event) {
    sender = document.querySelector("#username").value.trim();
    if (sender) {
        usernamePage.classList.add("visually-hidden");
        messagePage.classList.remove("visually-hidden");

        const socket = new SockJS(socketName);
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnect, onError);
    }
    event.preventDefault();
}

function onConnect() {
    debugger;
    stompClient.subscribe(socketPath, onMessageReceived);
    stompClient.send(controller_addUser, {}, JSON.stringify({sender: sender, type: 'JOIN'}));
}

function onError() {
    console.log("error");
}

function onMessageReceived(payload) {
    debugger;
    const chat = JSON.parse(payload.body);
    const messageElement = document.createElement("li");

    if (chat.type === 'JOIN') {
        chat.message = chat.sender + ' joined the chat!';
        const text = document.createTextNode(chat.message);
        messageElement.appendChild(text);
        messageElement.classList.add("notifyChat");
    } else if (chat.type === 'LEAVE') {
        chat.message = chat.sender + ' left the chat!';
        const text = document.createTextNode(chat.message);
        messageElement.appendChild(text);
        messageElement.classList.add("notifyChat");
    } else {

        const icon = document.createElement("span");
        icon.appendChild(document.createTextNode(chat.sender.charAt(0)));
        if (icon.style.backgroundColor === "") {
            icon.style.backgroundColor = getRandomColor(chat.sender);
        }
        icon.classList.add("icon");

        const div = document.createElement("div");
        const senderNameSpan = document.createElement("span");
        const messageSpan = document.createElement("span");
        senderNameSpan.appendChild(document.createTextNode(chat.sender));
        messageSpan.appendChild(document.createTextNode(chat.message));
        div.appendChild(senderNameSpan)
        div.appendChild(messageSpan);

        messageElement.appendChild(icon)
        messageElement.appendChild(div);
        messageElement.classList.add("chatMessage")
    }
    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function sendMessage(event) {
    debugger;
    const message = document.querySelector("#message").value.trim();
    if (message && stompClient) {
        const chatMessage = {sender: sender, message: message, type: 'CHAT'};
        stompClient.send(controller_sendMessage, {}, JSON.stringify(chatMessage));
        document.querySelector("#message").value = '';
    }
    event.preventDefault();
}

function getRandomColor(sender) {
    let hash = 0;
    for (let i = 0; i < sender.length; i++) {
        hash += "" + sender.charCodeAt(i);
    }
    return colors[Math.abs(hash % colors.length)];
}
