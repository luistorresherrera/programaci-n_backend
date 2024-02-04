const socket = io();

//REGISTRAR CORREO ELECTRÓNICO PARA EMPEZAR A CHATEAR
const btn_lockEmail = document.getElementById("lockEmail");
btn_lockEmail.addEventListener("click", (event) => {
  event.preventDefault();
  const inputEmail = document.getElementById("email");

  if (
    inputEmail.value.trim() == "" ||
    !inputEmail.value.includes("@") ||
    !inputEmail.value.includes(".")
  ) {
    alert("Debe tener email válido. ");
    return;
  }
  localStorage.setItem("email", inputEmail.value);
  inputEmail.setAttribute("disabled", "true");
  alert("Email registrado. Puedes empezar a chatear.");
  intervalGetMessages();
});

//Iniciar función cíclica para cargar los mensajes
const intervalGetMessages = () => {
  setInterval(() => {
    socket.emit("getMessages");
  }, 500);
};

//ENVIAR MENSAJE AL SERVIDOR
const btn_sendMessage = document.getElementById("sendMessage");
btn_sendMessage.addEventListener("click", async (event) => {
  event.preventDefault();
  const inputMessage = document.getElementById("message");
  const inputEmail = localStorage.getItem("email");
  if (inputMessage.value.trim() == "") {
    alert("Debe tener un mensaje. ");
    return;
  }

  const resultMensaje = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: inputEmail,
      message: inputMessage.value,
    }),
  });
  if (resultMensaje.status == 200) {
    intervalGetMessages();
    inputMessage.value = "";
  } else {
    alert("No se puede enviar el mensaje.");
  }
});

//CARGAR LOS MENSAJES QUE ESTÁN EN LA BASE DE DATOS PERO QUE ENVÍA EL SERVIDOR CON WEB SOCKET
const loadMessages = (data) => {
  let htmlMessages = "";
  data.forEach((message) => {
    if (message.email == localStorage.getItem("email")) {
      htmlMessages += `
        <div class="ownMessageDialog">
            <strong>${message.email}</strong>
            <p>${message.message}</p>
        </div>
    `;
    } else {
      htmlMessages += `
        <div class="otherMessageDialog">
            <strong>${message.email}</strong>
            <p>${message.message}</p>
        </div>
    `;
    }
  });
  document.getElementById("messagesArea").innerHTML = htmlMessages;
};

//ESCUCHA LA RESPUESTA DEL SERVIDOR CON LOS PRODUCTOS

socket.on("receiveMessages", async (data) => {
  loadMessages(data);
});
