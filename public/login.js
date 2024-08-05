const form = document.querySelector("#formulario");
const inputEmail = document.querySelector("#email");
const inputCode = document.querySelector("#code");
const codeBtn = document.querySelector("#codeBtn");

const baseBackendUrl = `${window.origin}/api`;

codeBtn.addEventListener("click", async () => {
  console.log("pidiendo codigo");
  try {
    if(!inputEmail.value) {
      Swal.fire("Ups!", "Debes ingresar un correo", "info")
      return
    }
    

    const res = await fetch(
      `${baseBackendUrl}/auth/login/${inputEmail.value}/code`,
      {
        method: "POST",
      }
    );
    const resJSON = await res.json();
  } catch (error) {
    console.log({error})
  }
  
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("Intentando iniciar sesion");
  if(!inputEmail.value || !inputCode.value) {
    Swal.fire("Ups!", "Debes ingresar un correo", "info")
    return
  }
  
  const res = await fetch(`${baseBackendUrl}/auth/login/${inputEmail.value}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ code: inputCode.value }),
  });
  const resJSON = await res.json();
  window.location.href = '/'
});
