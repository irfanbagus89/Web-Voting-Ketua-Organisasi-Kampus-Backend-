const mongoose = require("mongoose");
const User = require("./userModel");
const kandidatSchema = new mongoose.Schema({
  nbi: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  visiMisi: {
    type: String,
    required: true,
  },
  jumlahPemilih: {
    type: Number,
    default: 0,
  },
  createdByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  votingDeadline: {
    type: Date,
    default: null,
  },
  prodi: {
    type: String,
    enum: ["Teknik Informatika", "Teknik Elektro"],
  },
  kategori: {
    type: String,
    enum: ["BEM", "HIMA"],
    required: true,
  },
  terdaftar: {
    type: Boolean,
    default: true,
  },
  votingStart: {
    type: Date,
    default: null,
  },
  jabatan: {
    type: String,
    required: true,
    default: 'Ketua'
  },
});

const Kandidat = mongoose.model("Kandidat", kandidatSchema);

module.exports = Kandidat;
