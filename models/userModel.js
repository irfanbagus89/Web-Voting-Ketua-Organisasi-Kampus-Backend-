const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Kandidat = require("./kandidatModel");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  nbi: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  refreshToken: {
    type: String,
  },
  selectedKandidat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Kandidat",
  },
  hasVoted: {
    type: Boolean,
    default: false,
  },
  prodi: {
    type: String,
    enum: ["Teknik Informatika", "Teknik Elektro",],
  },
},
{
  timestamps: true,
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);

  if (this.nbi.startsWith("146")) {
    this.prodi = "Teknik Informatika";
  } else if (this.nbi.startsWith("148")) {
    this.prodi = "Teknik Elektro";
  }
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
