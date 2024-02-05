const addToCart = async (p_id) => {
  if (sessionStorage.getItem("cart")) {
    const cartId = JSON.parse(sessionStorage.getItem("cart"));
    //AGREGAR EL PRODUCTOS AL CARRITO QUE ESTÁ EN SESSION STORAGE
    const response = await fetch(`../api/carts/${cartId}/product/${p_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    alert("Se agrego el producto al carrito");
  } else {
    //CREAR CARRITO PORQUE NO EXISTE
    const newCart = await fetch("../api/carts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
    sessionStorage.setItem("cart", newCart.id);
    //AGREGAR EL PRODUCTOS AL CARRITO CREADO
    const response = await fetch(
      `../api/carts/${await newCart.id}/product/${p_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    alert("Se agrego el producto al carrito");
  }
};

const btnAddToCart = document.querySelectorAll("#btn_addToCart");
btnAddToCart.forEach((element) => {
  element.addEventListener("click", (event) => {
    addToCart(event.target.name);
  });
});

const btnCarrito = document.querySelectorAll("#btn_cart");
btnCarrito.forEach((element) => {
  element.addEventListener("click", (event) => {
    const url = `../cart/${sessionStorage.getItem("cart")}`;
    window.location.href = url;
  });
});

const setBackURL = () => {
  const currentUrl = window.location.href;
  sessionStorage.setItem("backURL", currentUrl);
  return currentUrl;
};

//BOTON VER DETALLE

const verDetalle = (p_id) => {
  setBackURL();
  const url = `../products/${p_id}`;
  window.location.href = url;
};

const btnVerDetalle = document.querySelectorAll("#btn_verDetalle");
btnVerDetalle.forEach((element) => {
  element.addEventListener("click", (event) => {
    verDetalle(event.target.name);
  });
});

const btnBack = document.querySelectorAll("#btn_back");
btnBack.forEach((element) => {
  element.addEventListener("click", (event) => {
    const url = sessionStorage.getItem("backURL");
    window.location.href = url;
  });
});
