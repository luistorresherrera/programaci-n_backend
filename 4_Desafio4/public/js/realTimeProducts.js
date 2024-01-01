const socket = io(); // Configuración para usar socket del lado del cliente
socket.emit("getProducts");
let divProductos = document.getElementById("totalContainer");

let urlApiPost = "/api/products?";
//Agregar productos desde el formulario
let objetoForm = {};

//traer los campos del formulario y asignarlos a la url del api
const formulario = document.getElementById("addProductForm");
const elementos = formulario.querySelectorAll("[name]");
const concatenarURL = () => {
  let count = 0;
  urlApiPost = "/api/products?";
  elementos.forEach((elemento) => {
    objetoForm[elemento.name] = elemento.value;
    urlApiPost +=
      ++count != elementos.length
        ? `${elemento.name}=${elemento.value}&`
        : `${elemento.name}=${elemento.value}`;
  });
  console.log(urlApiPost);
};

//Cuando presionas el botón submit utilizar api post
const btnSubmitForm = document.getElementById("btnAddProduct");
btnSubmitForm.addEventListener("click", async (event) => {
  console.log(urlApiPost);
  try {
    event.preventDefault();

    concatenarURL();
    //Envío un mensaje que estoy solicitando los productos

    const response = await fetch(urlApiPost, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status == 200) {
      socket.emit("getProducts");
      alert("Se agrego el producto satisfactoriamente.");
    } else {
      alert("No se pudo agregar el producto.");
    }

    formulario.reset();
  } catch (error) {
    alert("Hubo un error: " + error);
  }
});

// Mostrar productos desde el API GET Products con websocket

//función de pintado de productos
const loadProducts = (obj) => {
  let htmlProducts = "";
  obj.forEach(async (product) => {
    const flag = () => {
      return product.status == 0
        ? {
            color: "red",
            text: "Inactivo",
            boton: "Activar",
            onclick: "activar()",
          }
        : {
            color: "green",
            text: "Activo",
            boton: "Eliminar",
            onclick: "desactivar()",
          };
    };
    htmlProducts += `<div class="productContainer">
          <div class="productImage"><img src="${product.thumbnail}" alt="${
      product.title
    }"></div>
          <div class="productInfo">
          <strong>${product.title}</strong>
          <div>${product.description}</div>
          <div><span><strong>Precio:</strong></span> USD ${product.price}</div>
          <div><span><strong>Stock:</strong></span> ${product.stock}</div>
          <div><span><strong>Código:</strong></span> ${product.code}</div>
          <div class="activationContainer"><p class="activationFlag" style="color:${
            flag().color
          };">${flag().text}
            </p><button onclick=${flag().onclick}  name="${
      product.id
    }" class="btn-${flag().boton}" id=${product.id}|${product.status} >${
      flag().boton
    } producto</button></div>
          </div>
        </div>`;
  });
  const divProductos = document.getElementById("totalContainer");
  divProductos.innerHTML = htmlProducts;
};

//Escucha la respuesta del server para mostrar los productos
socket.on("sendProducts", async (data) => {
  loadProducts(data);
});

//Eliminar productos

const desactivar = async (event) => {
  try {
    const response = await fetch(
      `/api/products${Number(event.target.getAttribute("name"))}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status == 200) {
      socket.emit("getProducts");
      alert("Se elimino el producto satisfactoriamente.");
    } else {
      alert("No se pudo eliminar el producto.");
    }
  } catch (error) {
    alert("Hubo un error: " + error);
  }
};

const activar = () => {
  alert("Todavía no tenemos la función de activación");
};
