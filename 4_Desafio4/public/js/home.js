let divProductos = document.getElementById("totalContainer");
// console.log(divProductos.innerHTML);
let htmlProducts = "";
const funcionGetProducts = async () => {
  const products = await fetch("/api/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  products.forEach(async (product) => {
    const flag = () => {
      return product.status == 0
        ? { color: "red", text: "Inactivo" }
        : { color: "green", text: "Activo" };
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
      <p class="activationFlag" style="background-color:${flag().color};">${
      flag().text
    }
        </p>
      </div>
    </div>`;
  });

  return htmlProducts;
};

divProductos.innerHTML = await funcionGetProducts();
