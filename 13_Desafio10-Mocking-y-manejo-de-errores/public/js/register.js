const btn_register = document.getElementById("btn_register");

btn_register.addEventListener("click", async (event) => {
  try {
    event.preventDefault();

    if (
      document.getElementById("password").value !=
      document.getElementById("password-retype").value
    )
      return (document.getElementById("error_message").innerHTML =
        "Las contraseñas no coinciden");

    const result = await fetch("/api/sessions/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        birthdate: document.getElementById("birthdate").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        password_retype: document.getElementById("password-retype").value,
      }),
    }).then((res) => res.json());

    if (result.status == "OK")
      return (window.location.href = "./login?register=true");
    if (result.status == "ERROR")
      return (document.getElementById("error_message").innerHTML =
        result.message);
  } catch (error) {
    console.log(error);
  }
});
