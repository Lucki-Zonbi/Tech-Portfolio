document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".shot-card, .snippet-card, .hero-card");
  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(18px)";
    setTimeout(() => {
      card.style.transition = "opacity .45s ease, transform .45s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 90);
  });
});
