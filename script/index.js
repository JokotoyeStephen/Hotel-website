 const menuIcon = document.getElementById('our');
const navlinks = document.getElementById('menuicon');

menuIcon.addEventListener('click', () => {
    navlinks.classList.toggle('active');
});
 
 var typed = new Typed('#typed', {
      strings: ["Enjoy Your Dream Vacation","Find your perfect stay with us","Welcome to  ZOE Hotel <br> Where Comfort Meets Elegance", "Discover a Place of Peace, Luxury & Comfort", "Escape the Ordinary, Stay in Style"],
      typeSpeed: 100,
      backspeed: 50,
      backDelay: 1000,
      loop: true
    });



      let slideIndex = 0;
    showSlides();

    function showSlides() {
      let slides = document.querySelectorAll(".slide");
      slides.forEach((slide) => (slide.style.display = "none"));
      slideIndex++;
      if (slideIndex > slides.length) slideIndex = 1;
      slides[slideIndex - 1].style.display = "block";
      setTimeout(showSlides, 5000); // Change slide every 5 seconds
    }