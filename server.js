import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import { dirname } from "path";
import mongoose from "mongoose";
import Reservation from "./models/reservation.js";
import { fileURLToPath } from "url";
import Swal from "sweetalert2";
import axios from "axios";


const _dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();

const app = express();
const PORT = process.env.PORT || 2025;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const publicPath = path.join(_dirname, "public");
app.use(express.static(publicPath));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err.message));

// Room pricing
const roomPrices = {
    "Standard": 40000,
    "Deluxe": 65000,
    "Executive": 80000,
    "Accessible": 90000,
    "Premier": 150000,
    "Presidential": 200000,
    "Twin": 120000,
    "Villa": 250000,
    "Cabana": 300000,
};

// Night calculation
function calculateNights(indate, outdate) {
  const checkIn = new Date(indate);
  const checkOut = new Date(outdate);
  const diffTime = Math.abs(checkOut - checkIn);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
}

app.post("/booking", async (req, res) => {
  try {
    const {
      indate, outdate, firstname, email, phone, country,
      lastname, guest, breakbox, room, airbox, extrabox,
      latebox, message, pet
    } = req.body;

    // Convert form checkbox values to booleans
    const parsedBreakbox = breakbox === "on";
    const parsedAirbox = airbox === "on";
    const parsedExtrabox = extrabox === "on";
    const parsedLatebox = latebox === "on";
    const parsedpet = pet === "on";


    const nights = calculateNights(indate, outdate);
    const roomKey = room.trim().toLowerCase();
    const roomPrice = roomPrices[roomKey] || 0;

    let addons = 0;
    if (parsedBreakbox) addons += 4500 * nights;
    if (parsedAirbox) addons += 30000;
    if (parsedExtrabox) addons += 50000;
    if (parsedLatebox) addons += 10000;
    if (parsedpet) addons += 10000;
    if (message?.trim()) addons += 10000;

    const totalPrice = roomPrice * nights + addons;
    const reservationID = `RES-${Math.floor(100000 + Math.random() * 900000)}`;

    const pdfFilename = `booking-${Date.now()}.pdf`;
    const pdfPath = path.join(publicPath, pdfFilename);
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // Hotel logo
    const logoPath = path.join(publicPath, "hotel-logo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 30, { width: 100 });
    }

    doc.moveDown(3);
    doc.fontSize(18).text(`Reservation ID: ${reservationID}`, { align: "right" });
    doc.moveDown();

    doc.fontSize(20).fillColor("darkblue").text("Booking Confirmation", { underline: true });
    doc.moveDown();

    doc.fontSize(12).fillColor("black");
    doc.text(`Name: ${firstname} ${lastname}`);
    doc.text(`Room Type: ${room}`);
    doc.text(`Check-in: ${indate}`);
    doc.text(`Check-out: ${outdate}`);
    doc.text(`Total Price: ?${totalPrice.toLocaleString()}`);
    doc.text("Includes:");
    if (parsedBreakbox) doc.text("- Breakfast");
    if (parsedAirbox) doc.text("- Airport Pickup");
    if (parsedExtrabox) doc.text("- Extra Bed");
    if (parsedLatebox) doc.text("- Late Checkout");
    if (parsedpet) doc.text("- pets");
    if (message?.trim()) doc.text("- Special Request");

    doc.moveDown();

    const qrDataURL = await QRCode.toDataURL(reservationID);
    const qrImage = qrDataURL.replace(/^data:image\/png;base64,/, "");
    const qrPath = path.join(publicPath, `qr-${Date.now()}.png`);
    fs.writeFileSync(qrPath, qrImage, "base64");

    doc.text("Scan QR Code for Reservation:");
    doc.image(qrPath, { width: 100 });
    doc.end();

    await new Promise(resolve => writeStream.on("finish", resolve));

    // Save to database
    await Reservation.create({
      firstname,
      lastname,
      email,
      phone,
      country,
      indate,
      outdate,
      guest,
      room,
      breakbox: parsedBreakbox,
      airbox: parsedAirbox,
      extrabox: parsedExtrabox,
      latebox: parsedLatebox,
      pet: parsedpet,
      message,
      totalPrice,
      reservationID,
    });

    // Email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Admin Email
    const adminMail = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Booking from ${firstname} ${lastname}`,
      html: `
        <h2>Full Booking Details</h2>
        <p><strong>Reservation ID:</strong> ${reservationID}</p>
        <p><strong>Name:</strong> ${firstname} ${lastname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Guests:</strong> ${guest}</p>
        <p><strong>Room:</strong> ${room}</p>
        <p><strong>Check-in:</strong> ${indate}</p>
        <p><strong>Check-out:</strong> ${outdate}</p>
        <p><strong>Breakfast:</strong> ${parsedBreakbox ? "Yes" : "No"}</p>
        <p><strong>Airport Pickup:</strong> ${parsedAirbox ? "Yes" : "No"}</p>
        <p><strong>Extra Bed:</strong> ${parsedExtrabox ? "Yes" : "No"}</p>
        <p><strong>Late Checkout:</strong> ${parsedLatebox ? "Yes" : "No"}</p>
        <p><strong>With Pet:</strong> ${parsedpet ? "Yes" : "No"} </p>
        <p><strong>Special Request:</strong> ${message}</p>
        <p><strong>Total Price:</strong> ₦${totalPrice.toLocaleString()}</p>
      `,
      attachments: [{ filename: "BookingDetails.pdf", path: pdfPath }],
    };

    // Guest Email
    const guestMail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Booking Confirmation",
      html: `
        <h2>Hi ${firstname},</h2>
        <p>Your booking has been confirmed. Details below:</p>
        <ul>
          <li><strong>Reservation ID:</strong> ${reservationID}</li>
          <li><strong>Room:</strong> ${room}</li>
          <li><strong>Check-in:</strong> ${indate}</li>
          <li><strong>Check-out:</strong> ${outdate}</li>
          <li><strong>Total Price:</strong> ? ${totalPrice.toLocaleString()}</li>
        </ul>
        <p>Thank you for booking with ZOE Hotel.</p>
      `,
      attachments: [{ filename: "BookingConfirmation.pdf", path: pdfPath }],
    };

    await transporter.sendMail(adminMail);
    await transporter.sendMail(guestMail);

    res.redirect("/successful.html");
    console.log("Email sent and booking saved.");

    // Delete files after 30 seconds
    setTimeout(() => {
      fs.unlink(pdfPath, () => {});
      fs.unlink(qrPath, () => {});
    }, 30000);

  } catch (err) {
    console.error("Booking error:", err.message);
    res.redirect("/error.html");
  }
});

app.post("/feedback", async (req, res) => {
  // let star =star.value

  const { name, email, comment, rating, clean, service } = req.body;
  // console.log(req.body);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `New Feedback from ${name}`,
    html: `
      <h1> New Feedback Received </h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Comment:</strong> ${comment}</p>
      <p><strong>Rate us:</strong> ${rating}</p>
      <p><strong>Cleanliness:</strong> ${clean}</p>
      <p><strong>Service:</strong> ${service}</p>
    `
  };

 try {
    const feedback = req.body.feedback; // Assuming feedback is sent in the body
    // Here you would typically process the feedback (e.g., save to a database)

    res.json({
      status: "success",
      message: "Your feedback has been received successfully!",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong, please try again.",
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});