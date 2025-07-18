import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import QRCode from "qrcode";

const _dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();

const app = express();
const PORT = process.env.PORT || 2025;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const filepath = path.join(_dirname, "public");
app.use(express.static(filepath));

app.post("/booking", async (req, res) => {
  const {
    indate, outdate, firstname, email, phone, country,
    lastname, guest, breakbox, room, airbox, extrabox,
    latebox, message, fullname, card, expiry, cw
  } = req.body;

  const reservationID = `RES-${Math.floor(100000 + Math.random() * 900000)}`;

  // Calculate stay duration in days
  const inDateObj = new Date(indate);
  const outDateObj = new Date(outdate);
  const stayDuration = Math.ceil((outDateObj - inDateObj) / (1000 * 60 * 60 * 24));

  // Define room prices
  const roomPrices = {
    "standard room": 95000,
    "deluxe room": 70000,
    "executive room": 165000,
    "accessible room": 200000,
    "premier room": 300000,
    "presidential room": 350000,
    "twin room": 180000,
    "villa room": 370000,
    "cabana room": 450000
  };

  const selectedRoom = room.toLowerCase();
  let basePrice = roomPrices[selectedRoom] || 0;
  let totalPrice = basePrice * stayDuration;

  if (breakbox === 'on') totalPrice += 4500 * stayDuration;
  if (airbox !== 'on') totalPrice += 30000;
  if (extrabox === 'on') totalPrice += 50000;
  if (latebox === 'on') totalPrice += 10000;
  if (message && message.trim() !== '') totalPrice += 10000;

  const pdfFilename = `booking-${Date.now()}.pdf`;
  const pdfPath = path.join(_dirname, 'public', pdfFilename);
  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  const logoPath = path.join(_dirname, 'public', 'hotel-logo.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 30, { width: 40 });
  }
  doc.moveDown(3);

  doc.fontSize(16).text(`Reservation ID: ${reservationID}`, { align: "right" });
  doc.moveDown();

  doc.fontSize(20).text('ZOE Hotel Booking Details', { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(`Name: ${firstname} ${lastname}`);
  doc.text(`Email: ${email}`);
  doc.text(`Phone: ${phone}`);
  doc.text(`Country: ${country}`);
  doc.text(`Check-in Date: ${indate}`);
  doc.text(`Check-out Date: ${outdate}`);
  doc.text(`Number of Guests: ${guest}`);
  doc.text(`Room Type: ${room}`);
  doc.text(`Stay Duration: ${stayDuration} night(s)`);
  doc.text(`Breakfast: ${breakbox === 'on' ? 'Yes' : 'No'}`);
  doc.text(`Airport Pickup: ${airbox === 'on' ? 'Yes' : 'No'}`);
  doc.text(`Extra Bed: ${extrabox === 'on' ? 'Yes' : 'No'}`);
  doc.text(`Late Checkout: ${latebox === 'on' ? 'Yes' : 'No'}`);
  doc.text(`Special Request: ${message || 'None'}`);
  doc.text(`Total Price: ₦ ${totalPrice.toLocaleString()}`);
  doc.moveDown();

  doc.fontSize(14).text('Payment Info', { underline: true });
  doc.fontSize(12).text(`Cardholder: ${fullname}`);
  doc.text(`Card Number: ${card}`);
  doc.text(`Expiry: ${expiry}`);
  doc.text(`CW: ${cw}`);
  doc.moveDown();

  const qrDataURL = await QRCode.toDataURL(reservationID);
  const qrImage = qrDataURL.replace(/^data:image\/png;base64,/, "");
  const qrPath = path.join(_dirname, 'public', `qr-${Date.now()}.png`);
  fs.writeFileSync(qrPath, qrImage, 'base64');
  doc.text('Scan QR Code for Booking ID:');
  doc.image(qrPath, { width: 100, align: "left" });
  doc.end();

  await new Promise(resolve => writeStream.on('finish', resolve));

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: { rejectUnauthorized: false }
  });

  const adminMail = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Booking from ${firstname} ${lastname}`,
    html: `<h2>New Booking Received</h2><p>See attached reservation details.</p>`,
    attachments: [
      {
        filename: 'BookingDetails.pdf',
        path: pdfPath
      }
    ]
  };

  const guestMail = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Booking Confirmation',
    html: `<h2>Hello ${firstname},</h2><p>Your reservation is confirmed. ID: <strong>${reservationID}</strong></p><p>Total Price: ₦ ${totalPrice.toLocaleString()}</p><p>PDF attached with full details.</p>`,
    attachments: [
      {
        filename: 'BookingConfirmation.pdf',
        path: pdfPath
      }
    ]
  };


  try {
    await transporter.sendMail(adminMail);
    await transporter.sendMail(guestMail);
    res.redirect("/successful.html")
    console.log("successfilly sent")
  } catch (error) {
    console.error("Email error:", error.message);
    res.status(500).send("Error sending email.");
  } finally {
    setTimeout(() => {
      fs.unlink(pdfPath, () => {});
      fs.unlink(qrPath, () => {});
    }, 30000);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
