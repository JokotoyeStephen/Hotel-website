import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  phone: String,
  country: String,
  indate: String,
  outdate: String,
  guest: Number,
  room: String,
  breakbox: Boolean,
  airbox: Boolean,
  extrabox: Boolean,
  latebox: Boolean,
  message: String,
  fullname: String,
  card: String,
  expiry: String,
  cw: String,
  totalPrice: Number,
  reservationID: String,
}, { timestamps: true });
export default mongoose.model('Reservation', reservationSchema);

// export default Reservation;

