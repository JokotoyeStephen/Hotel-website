 const menuIcon = document.getElementById('our');
const navlinks = document.getElementById('menuicon');

menuIcon.addEventListener('click', () => {
    navlinks.classList.toggle('active');
});

document.querySelector("#feedbackForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.status === "success") {
      Swal.fire({
        icon: "success",
        title: "Thank You, Your request has been successful recieved!",
        text: result.message,
        confirmButtonText: "OK",
      }).then(() => {
        this.reset(); // Reset form after success
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: result.message,
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Server Error",
      text: "Could not submit your feedback. Please try again later.",
    });
  }
});
