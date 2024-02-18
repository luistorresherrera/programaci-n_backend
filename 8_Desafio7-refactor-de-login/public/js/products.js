const addToCart = async (p_id) => {
  const response = await fetch(`../api/carts/product/${p_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
  return response;
};

const btnAddToCart = document.querySelectorAll("#btn_addToCart");
btnAddToCart.forEach((element) => {
  element.addEventListener("click", async (event) => {
    const productAdded = await addToCart(event.target.name);
    if (productAdded.status == "OK") {
      return alert(productAdded.message);
    }
    return alert("No se pudo agregar el producto.");
  });
});

const btnCarrito = document.querySelectorAll("#btn_cart");
btnCarrito.forEach((element) => {
  element.addEventListener("click", (event) => {
    const url = `../cart`;
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
