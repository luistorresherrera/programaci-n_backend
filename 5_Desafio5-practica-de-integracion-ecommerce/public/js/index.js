const socket = io(); // Configuración para usar socket del lado del cliente

// socket.emit("message", "Hola como estás server");
socket.on("para-todos", (data) => {
  console.log(data);
});
