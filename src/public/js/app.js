const socket = io();

const welcome = document.getElementById("welcome");
const nameForm = welcome.querySelector("#name");
const roomNameForm = welcome.querySelector("#roomName");

const room = document.getElementById("room");

nameForm.addEventListener("submit", handleNicknameSubmit);

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#message input");
  const msg = input.value;
  socket.emit("new_message", msg, roomName, () => {
    addMessage(`You: ${msg}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = welcome.querySelector("#name input");
  const nickname = input.value;
  socket.emit("nickname", nickname);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#message");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = roomNameForm.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

roomNameForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, userCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${userCount})`;
  addMessage(`${user} joined!`);
});

socket.on("bye", (left, userCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${userCount})`;
  addMessage(`${left} left ㅠㅠ`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerText = "";
  if (!rooms.length) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
