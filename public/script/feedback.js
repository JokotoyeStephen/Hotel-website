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
    console.log(result);
    console.log(result.status);
    
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
    console.log(error.message)
    Swal.fire({
      icon: "error",
      title: "Server Error",
      text: "Could not submit your feedback. Please try again later.",
    });
  }
});

        document.getElementById('feedbackForm').onsubmit = function(event) {
            event.preventDefault(); // Prevent actual form submission

            const button = document.getElementById('submitFeedback');
            button.disabled = true; // Disable the button
            button.textContent = 'Submitting...'; // Change button text

            // Simulate form submission (e.g., AJAX call)
            setTimeout(() => {
                // Here you would typically handle the form submission
                // For example, using fetch or XMLHttpRequest

                // Show SweetAlert
                Swal.fire({
                    title: 'Feedback Submitted',
                    text: 'Your feedback has been received successfully!',
                    icon: 'success',
                    confirmButtonText: 'Okay'
                }).then(() => {
                    // Re-enable the button and reset text after the alert is closed
                    button.disabled = false;
                    button.textContent = 'Submit Feedback';
                });

            }, 2000); // Simulate a delay
        };