import io from "socket.io-client";

export const websocketClient = io(client_constants.url, {
  path: "/android",
  transports: ["websocket"],
  autoConnect: true,
  reconnect: true
});

export const websocketEventNames = {
  GOT_USERS: "gotUsers",
  GOT_CLOSEUP_EVENTS: "gotEvents",
  GET_ALL_USERS: "getAllUsers",
  GET_ALL_CLOSEUP_EVENTS: "getAllEvents"
};