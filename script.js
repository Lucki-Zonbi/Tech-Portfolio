//toggle icon navbar
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

//scroll sections
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 100;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');


        if(top >= offset && top < offset + height) {
           // active navbar links
           navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id +']').classList.add('active');
           });
           //active sections for animation on scroll
           sec.classList.add('show-animate');
        }
        //if want to use animation thatrepeats on scroll use this
        else {
            sec.classList.remove('show-animate');
        }
    });

    //sticky header
    let header = document.querySelector('header');

    header.classList.toggle('sticky', window.scrollY > 100);

    //remove toggle icon and navbar when click navbar links (scroll)
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');

    //animation footer on scroll
    let footer = document.querySelector('footer');

    footer.classList.toggle('show-animate', this.innerHeight + this.scrollY >= document.scrollingElement.scrollHeight);
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const submitButton = form.querySelector("button[type='submit']");

    // Create a success message container
    const messageBox = document.createElement("div");
    messageBox.style.marginTop = "1rem";
    messageBox.style.fontSize = "1rem";
    messageBox.style.textAlign = "center";
    form.appendChild(messageBox);

    form.addEventListener("submit", async function (e) {
        e.preventDefault(); // Stop default form submission

        const formData = new FormData(form);

        // Disable button and show sending state
        submitButton.disabled = true;
        submitButton.innerText = "Sending...";

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success visual feedback
                form.reset();
                messageBox.innerText = "Message sent successfully!";
                messageBox.style.color = "limegreen";

                //Animate and hide the form after delay
                form.style.transition = "opacity 0.5s ease";
                setTimeout(() => {
                    form.style.opacity = 0;
                }, 1000);

            } else {
                // Error feedback
                messageBox.innerText = "⚠️ Oops! Something went wrong.";
                messageBox.style.color = "crimson";
            }
        } catch (error) {
            // Network or unexpected error
            messageBox.innerText = "❌ Submission failed. Please try again.";
            messageBox.style.color = "red";
        } finally {
            //Re-enable button
            submitButton.disabled = false;
            submitButton.innerText = "Submit";
        }
    });
});
