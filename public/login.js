const form = document.querySelector("#formulario");
const inputEmail = document.querySelector("#email");
const inputCode = document.querySelector("#code");
const codeBtn = document.querySelector("#codeBtn");

const baseBackendUrl = `${window.origin}/api`;

codeBtn.addEventListener("click", async () => {
  console.log("pidiendo codigo");
  const res = await fetch(
    `${baseBackendUrl}/auth/login/${inputEmail.value}/code`,
    {
      method: "POST",
    }
  );
  const resJSON = await res.json();
  console.log(resJSON);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("Intentando iniciar sesion");
  const res = await fetch(`${baseBackendUrl}/auth/login/${inputEmail.value}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ code: inputCode.value }),
  });
  const resJSON = await res.json();
  console.log(resJSON);
});
