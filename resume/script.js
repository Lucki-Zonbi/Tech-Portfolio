const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.resume-nav');
const navLinks = document.querySelectorAll('.resume-nav a');
const sections = document.querySelectorAll('section[id]');

menuIcon?.addEventListener('click', () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuIcon?.classList.remove('bx-x');
        navbar?.classList.remove('active');
    });
});

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 140;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            document.querySelector(`.resume-nav a[href*=${sectionId}]`)?.classList.add('active');
        }
    });
});
