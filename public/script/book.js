 const roomPrices = {
        "Standard": 95000,
        "Deluxe": 70000,
        "Executive": 165000,
        "Accessible": 200000,
        "Premier": 300000,
        "Presidential": 350000,
        "Twin": 180000,
        "Villa": 370000,
        "Cabana": 450000,
    };

    // Night calculation
    function calculateNights(indate, outdate) {
        const checkIn = new Date(indate);
        const checkOut = new Date(outdate);
        const diffTime = Math.abs(checkOut - checkIn);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Return at least 1 night
    }

    document.getElementById('payBtn').onclick = function (event) {
        // Prevent the default form submission
        event.preventDefault();

        const email = document.querySelector('input[name="email"]').value; // Get the email
        const roomType = document.getElementById('room').value; // Get selected room type
        const checkInDate = document.querySelector('input[name="indate"]').value; // Get check-in date
        const checkOutDate = document.querySelector('input[name="outdate"]').value; // Get check-out date

        // Calculate nights and total amount
        const nights = calculateNights(checkInDate, checkOutDate);
        const pricePerNight = roomPrices[roomType];
        const totalAmount = nights * pricePerNight;

        // Initialize Paystack payment
        const handler = PaystackPop.setup({
            key: 'pk_test_359a8a92d754a8fa87f12b0feb73e871f69d7a2c', // Replace with your Paystack public key
            email: email,
            amount: totalAmount * 100, // Amount in kobo
            currency: 'NGN',
            callback: function (response) {
                alert('Payment successful! Transaction reference: ' + response.reference);
                // Now submit the form data to the backend
                document.querySelector('.booking-form').submit();
            },
            onClose: function () {
                alert('Payment popup closed.');
            }
        });

        handler.openIframe(); // Open the Paystack payment popup
    };


function getQueryParameter(name) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        }

        // Set the selected room based on the URL parameter
        const roomType = getQueryParameter('room');
        if (roomType) {
            const roomSelect = document.getElementById('room');
            roomSelect.value = roomType;
        }
        
const menuIcon = document.getElementById('our');
const navlinks = document.getElementById('menuicon');

menuIcon.addEventListener('click', () => {
    navlinks.classList.toggle('active');
 });

function getQueryParam(params) {
    const urlParams = new
    URLSearchParams(window.location/search)
    return urlParams.get(params)
}

const selectedRoom = getQueryParam("room");

if (selectedRoom){
    const roomSelect = document.getElementById("roomSelect")
    roomSelect.value=selectedRoom
}
//   e.preventDefault();

//   const formData = new FormData(e.target);
//   const bookingData = Object.fromEntries(formData.entries());

//   try {
//     // Call your backend /booking route
//     const res = await fetch("/booking", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(bookingData),
//     });

//     const data = await res.json();

//     if (data.data && data.data.authorization_url) {
//       // Redirect user to Paystack checkout
//       window.location.href = data.data.authorization_url;
//     } else {
//       alert("Failed to initialize payment");
//     }
//   } catch (err) {
//     console.error("Booking error:", err);
//     alert("Something went wrong, please try again");
//   }
// });

