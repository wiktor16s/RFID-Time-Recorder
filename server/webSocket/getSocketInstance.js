const getSocketInstance = (server, path) => {
  return require("socket.io")(server, { serveClient: false, path: path });
};

export default getSocketInstance;
