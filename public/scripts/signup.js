    // const signupButton = document.querySelector('#show-signup');
    // const signupPopup = document.querySelector('.signup-popup');
    // const closeButton = document.querySelector('.signup-popup .close-btn');

    // signupButton.addEventListener("click", () => {
    //     signupPopup.style.top = "0%";
    //     signupPopup.style.opacity = "1";
    //     signupPopup.classList.add("active");
    // });

    // closeButton.addEventListener("click", () => {
    //     signupPopup.style.top = "-150%";
    //     signupPopup.style.opacity = "0";
    //     signupPopup.classList.remove("active");
    // });


    // const form = document.querySelector('.form');

    // const usernameError = document.querySelector('.username.error');
    // const emailError = document.querySelector('.email.error');
    // const passwordError = document.querySelector('.password.error');

    // form.addEventListener('submit', async (err) => {
    //     err.preventDefault();

        
    //     // RESET 
    //     usernameError.textContent = "";
    //     emailError.textContent = "";
    //     passwordError.textContent = "";

    //     const username = form.username.value;
    //     const email = form.email.value;
    //     const password = form.password.value;

    //     try {
    //         const res = await fetch('/signup', {
    //             method: 'POST',
    //             body: JSON.stringify({
    //                 username: username,
    //                 email: email,
    //                 password: password 
    //             }),
    //             headers: { 'Content-Type': 'application/json' },
    //         });
    //         const data = await res.json();
    //         console.log(data);
    //         if (data.errors) {
    //             usernameError.textContent = data.errors.username;
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

    //     // console.log(username, email, password);
    // });