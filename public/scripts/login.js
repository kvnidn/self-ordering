// const loginButton = document.querySelector('#show-login');
// const loginPopup = document.querySelector('.login-popup');
// const closeButton = document.querySelector('.login-popup .close-btn');

// loginButton.addEventListener("click", () => {
//     loginPopup.style.top = "0%";
//     loginPopup.style.opacity = "1";
//     loginPopup.classList.add("active");
// });

// closeButton.addEventListener("click", () => {
//     loginPopup.style.top = "-150%";
//     loginPopup.style.opacity = "0";
//     loginPopup.classList.remove("active");
// });

// const form = document.querySelector('.form');
// const emailError = document.querySelector('.email.error');
// const passwordError = document.querySelector('.password.error');

// form.addEventListener('submit', async (err) => {
//     err.preventDefault();

    
//     // RESET 
//     emailError.textContent = "";
//     passwordError.textContent = "";

//     const email = form.email.value;
//     const password = form.password.value;

//     try {
//         const res = await fetch('/login', {
//             method: 'POST',
//             body: JSON.stringify({ email: email, password: password }),
//             headers: { 'Content-Type': 'application/json' },
//         });
//         const data = await res.json();
//         console.log(data);
//         if (data.errors) {
//             emailError.textContent = data.errors.email;
//             passwordError.textContent = data.errors.password;
//         }
//         if (data.user) {
//             location.assign('/');
//         }
//     }
//     catch (err) {
//         console.log(err);
//     }
//     // err.preventDefault();

//     // const email = form.email.value;
//     // const password = form.password.value;

//     // console.log(email, password);
// });