const btn_login = document.getElementById("btn_login");

btn_login.addEventListener("click", async (event) => {
  try {
    event.preventDefault();

    const result = await fetch("/api/sessions/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
      }),
    }).then((res) => res.json());

    if (result.status == "OK") return (window.location.href = "/products");
    if (result.status == "ERROR")
      return (document.getElementById("error_message").innerHTML =
        result.message);
  } catch (error) {
    console.log(error);
  }
});
