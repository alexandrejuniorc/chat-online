const $chatMessages = QuerySelector(".messages");

const setRoomActive = (room_id) => {
  QuerySelectorAll(".list-rooms li").forEach((itemList) => itemList.classList.remove("active"));
  QuerySelector(`#room-${room_id}`).classList.add("active");
  QuerySelector("#selected-room").value = room_id;
};

const getMessages = async (room_id) => {
  const response = await fetch(`/${room_id}`);
  const html = await response.text();
  $chatMessages.innerHTML = html;
  setRoomActive(room_id);
};

const sendMessage = async (data) => {
  console.log(data);

  const response = await fetch(`/${data.room_id}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": data.csrfmiddlewaretoken,
    },
    body: JSON.stringify(data),
  });
  const html = await response.text();
  const $uniqueMessageContainer = QuerySelector(".unique-message-container");
  $uniqueMessageContainer.insertAdjacentHTML("beforeend", html);
  QuerySelector(".send-message").reset();
};

const createRoom = async (data) => {
  const response = await fetch("/create-room", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": data.csrfmiddlewaretoken,
    },
    body: JSON.stringify(data),
  });
  const html = await response.text();
  const $listRooms = QuerySelector(".list-rooms");
  $listRooms.insertAdjacentHTML("afterbegin", html);
  const modal = bootstrap.Modal.getInstance(QuerySelector(".modal"));
  modal.hide();
  QuerySelector(".create-room").reset();
  getLastRoom();
};

const getLastRoom = () => {
  QuerySelector(".list-rooms li").click();
};

//// EVENTS

// intercept form send message
QuerySelector(".send-message").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  sendMessage(data);
});

// intercept form create room
QuerySelector(".create-room").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  createRoom(data);
});

// INIT
getLastRoom();