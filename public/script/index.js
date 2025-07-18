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



// // Example fetch call
// document.getElementById("booking-form").addEventListener("submit", async function (e) {
//   e.preventDefault(); // stop the form from submitting the default way

//   const formData = {
//     firstname: document.getElementById("firstname").value,
//     lastname: document.getElementById("lastname").value,
//     email: document.getElementById("email").value,
//     phone: document.getElementById("phone").value,
//     guest: document.getElementById("guest").value,
//     room: document.getElementById("room").value,
//     indate: document.getElementById("indate").value,
//     outdate: document.getElementById("outdate").value,
//   };

//   const response = await fetch("/api/book", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(formData),
//   });

//   const result = await response.json();
//   alert(result.message);
// });




      let slideIndex = 0;
    showSlides();

    function showSlides() {
      let slides = document.querySelectorAll(".slide");
      slides.forEach((slide) => (slide.style.display = "none"));
      slideIndex++;
      if (slideIndex > slides.length) slideIndex = 1;
      slides[slideIndex - 1].style.display = "block";
      setTimeout(showSlides, 12000); // Change slide every 5 seconds
    }

    