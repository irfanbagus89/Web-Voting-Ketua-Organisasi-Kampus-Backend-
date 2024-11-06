const { generateToken } = require("../configs/jwtToken");
const asyncHandler = require("express-async-handler");
const validateMongoDBid = require("../utils/validateMongoDBid");
const Kandidat = require("../models/kandidatModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets/kandidat");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.id_pengguna + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
}).single("foto");

// Create Kandidat bem
const createKandidatBEM = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const nbi = req.body.nbi;
  const findKandidat = await Kandidat.findOne({ nbi: nbi });
  const findDeadline = await Kandidat.findOne({
    votingDeadline: { $ne: null },
    kategori: "BEM",
    terdaftar: true,
  });
  console.log(findDeadline);
  if (!findKandidat && req.body.kategori === "BEM") {
    const newKandidat = await Kandidat.create({
      ...req.body,
      createdByAdmin: userId,
    });
    if (findDeadline) {
      newKandidat.votingDeadline = findDeadline.votingDeadline;
    }
    res.json(newKandidat);
  } else {
    const terdaftar = findKandidat.terdaftar;
    if (terdaftar !== true && req.body.kategori === "BEM") {
      const updateKandidat = await Kandidat.findByIdAndUpdate(
        findKandidat._id,
        {
          terdaftar: true,
          createdByAdmin: userId,
          visiMisi: req?.body?.visiMisi,
        },
        { new: true }
      );
      if (findDeadline) {
        updateKandidat.votingDeadline = findDeadline.votingDeadline;
        await updateKandidat.save();
      }
      res.json(updateKandidat);
    } else if (terdaftar !== true || req.body.kategori !== "BEM") {
      res.status(403).json({ message: "Tidak memiliki izin atau hak akses" });
    } else {
      res.status(400).json({ message: "Kandidat Sudah Terdaftar" });
    }
  }
});


// Create Kandidat hima
const createKandidatHIMA = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const nbi = req.body.nbi;
  const findKandidat = await Kandidat.findOne({ nbi: nbi });
  const userProdi = req.user.prodi;

  if (
    !findKandidat &&
    req.body.kategori === "HIMA" &&
    userProdi === req.body.prodi
  ) {
    const newKandidatData = {
      ...req.body,
      createdByAdmin: userId,
    };

    const findDeadline = await Kandidat.findOne({
      votingDeadline: { $ne: null },
      kategori: "HIMA",
      prodi: userProdi,
      terdaftar: true,
    });

    if (findDeadline) {
      newKandidatData.votingDeadline = findDeadline.votingDeadline;
    }

    const newKandidat = await Kandidat.create(newKandidatData);
    res.json(newKandidat);
  } else if (
    findKandidat &&
    req.body.kategori === "HIMA" &&
    userProdi === req.body.prodi
  ) {
    const terdaftar = findKandidat.terdaftar;

    if (terdaftar !== true) {
      const updateData = {
        terdaftar: true,
        createdByAdmin: userId,
        visiMisi: req?.body?.visiMisi,
      };

      const findDeadline = await Kandidat.findOne({
        votingDeadline: { $ne: null },
        kategori: "HIMA",
        prodi: userProdi,
        terdaftar: true,
      });

      if (findDeadline) {
        updateData.votingDeadline = findDeadline.votingDeadline;
      }

      const updateKandidat = await Kandidat.findByIdAndUpdate(
        findKandidat._id,
        updateData,
        { new: true }
      );

      res.json(updateKandidat);
    } else {
      res.status(400).json({ message: "Kandidat Sudah Terdaftar" });
    }
  } else {
    res.status(403).json({ message: "Tidak memiliki izin atau hak akses" });
  }
});

// Get All Kandidat
const getAllKandidat = asyncHandler(async (req, res) => {
  try {
    const getKandidat = await Kandidat.find();
    res.json(getKandidat);
  } catch (error) {
    throw new Error(error);
  }
});

// Get One Kandidat
const getAKandidat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBid(id);
  try {
    const getKandidat = await Kandidat.findById(id);
    console.log(getKandidat.createdByAdmin);
    res.json(getKandidat);
  } catch (error) {
    throw new Error(error);
  }
});

// Get All Kandidat BEM
const getAllKandidatBEM = asyncHandler(async (req, res) => {
  try {
    const getKandidat = await Kandidat.find({
      kategori: "BEM",
      terdaftar: true,
    });
    res.json(getKandidat);
  } catch (error) {
    throw new Error(error);
  }
});

// Get All Kandidat HIMA
const getAllKandidatHIMA = asyncHandler(async (req, res) => {
  try {
    const getKandidat = await Kandidat.find({
      kategori: "HIMA",
      prodi: req.user.prodi,
      terdaftar: true,
    });
    res.json(getKandidat);
  } catch (error) {
    throw new Error(error);
  }
});



// Update a Kandidat BEM
const updateAKandidatBEM = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  validateMongoDBid(id);
  const kandidat = await Kandidat.findById(id);
  if (kandidat.kategori === "BEM") {
    try {
      const updateKandidat = await Kandidat.findByIdAndUpdate(
        id,
        {
          visiMisi: req?.body?.visiMisi,
          jabatan: req?.body?.jabatan,
          createdByAdmin: userId,
        },
        {
          new: true,
        }
      );
      res.json(updateKandidat);
    } catch (error) {
      throw new Error(error);
    }
  } else {
    res.status(403).json({ message: "Tidak memiliki izin atau hak akses" });
  }
});



// Update a Kandidat HIMA
const updateAKandidatHIMA = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  validateMongoDBid(id);
  const kandidat = await Kandidat.findById(id);
  if (kandidat.kategori === "HIMA" && kandidat.prodi === req.user.prodi) {
    try {
      const updateKandidat = await Kandidat.findByIdAndUpdate(
        id,
        {
          visiMisi: req?.body?.visiMisi,
          jabatan: req?.body?.jabatan,
          createdByAdmin: userId,
        },
        {
          new: true,
        }
      );
      res.json(updateKandidat);
    } catch (error) {
      throw new Error(error);
    }
  } else {
    res.status(403).json({ message: "Tidak memiliki izin atau hak akses" });
  }
});



//Delete a Kandidat BEM
const deleteAKandidatBEM = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBid(id);
  const kandidat = await Kandidat.findById(id);
  if (kandidat.kategori === "BEM") {
    try {
      const deleteKandidat = await Kandidat.findByIdAndDelete(id);
      res.json(deleteKandidat);
    } catch (error) {
      throw new Error(error);
    }
  } else {
    res.status(403).json({ message: "Tidak memiliki izin atau hak akses" });
  }
});

//Delete a Kandidat Hima
const deleteAKandidatHIMA = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBid(id);
  const kandidat = await Kandidat.findById(id);
  if (kandidat.kategori === "HIMA" && kandidat.prodi === req.user.prodi) {
    try {
      const deleteKandidat = await Kandidat.findByIdAndDelete(id);
      res.json(deleteKandidat);
    } catch (error) {
      throw new Error(error);
    }
  } else {
    res.status(403).json({ message: "Tidak memiliki izin atau hak akses" });
  }
});


// Set deadline voting BEM
const setDeadlineVoteBEM = asyncHandler(async (req, res) => {
  const deadlineValue = req.body.votingDeadline;
  const findKandidat = await Kandidat.findOne({
    kategori: "BEM",
    terdaftar: true,
  });
  if (!findKandidat) {
    return res.status(404).json({ message: "Kandidat Tidak Ada" });
  } else {
    if (!deadlineValue) {
      return res.status(400).json({ message: "Nilai deadline tidak valid" });
    }
    const deadline = new Date(deadlineValue);

    if (isNaN(deadline.getTime())) {
      return res.status(400).json({ message: "Format waktu tidak valid" });
    }
    deadline.setUTCHours(deadline.getUTCHours() + 7);
    const currentTime = new Date();

    if (currentTime.setUTCHours(currentTime.getUTCHours() + 7) <= deadline) {
      try {
        await Kandidat.updateMany(
          { terdaftar: true, kategori: "BEM" },
          { votingDeadline: deadline }
        );
        return res
          .status(200)
          .json({ message: "Deadline Berhasil di Set Disemua Kandidat" });
      } catch (error) {
        return res.status(500).json({ message: "Gagal Mengset Deadline" });
      }
    } else {
      await Kandidat.updateMany(
        { terdaftar: true, kategori: "BEM" },
        { terdaftar: false, votingDeadline: null }
      );
      return res.status(200).json({ message: "Deadline Telah Terlewat" });
    }
  }
});

// Set deadline voting HIMA
const setDeadlineVoteHIMA = asyncHandler(async (req, res) => {
  const deadlineValue = req.body.votingDeadline;

  const findKandidat = await Kandidat.findOne({
    prodi: req.user.prodi,
    kategori: "HIMA",
    terdaftar: true,
  });

  if (!findKandidat) {
    return res.status(404).json({ message: "Kandidat Tidak Ada" });
  }

  if (!deadlineValue) {
    return res.status(400).json({ message: "Nilai deadline tidak valid" });
  }

  const deadline = new Date(deadlineValue);

  if (isNaN(deadline.getTime())) {
    return res.status(400).json({ message: "Format waktu tidak valid" });
  }
  deadline.setUTCHours(deadline.getUTCHours() + 7);
  const currentTime = new Date();

  if (currentTime.setUTCHours(currentTime.getUTCHours() + 7) <= deadline) {
    try {
      await Kandidat.updateMany(
        { terdaftar: true, kategori: "HIMA", prodi: req.user.prodi },
        { votingDeadline: deadline }
      );
      return res
        .status(200)
        .json({ message: "Deadline Berhasil di Set Disemua Kandidat" });
    } catch (error) {
      return res.status(500).json({ message: "Gagal Mengset Deadline" });
    }
  } else {
    await Kandidat.updateMany(
      { terdaftar: true, kategori: "HIMA", prodi: req.user.prodi },
      { terdaftar: false, votingDeadline: null }
    );
    return res.status(200).json({ message: "Deadline Telah Terlewat" });
  }
});




// Set Start Vote BEM
const setStartVoteBEM = asyncHandler(async (req, res) => {
  const startValue = req.body.startVote;
  const findKandidat = await Kandidat.findOne({
    kategori: "BEM",
    terdaftar: true,
    votingDeadline: { $ne: null },
  });
  if (!findKandidat) {
    return res.status(404).json({ message: "Deadline Voting Belum di Set" });
  } else {
    if (!startValue) {
      return res.status(400).json({ message: "Nilai deadline tidak valid" });
    }
    const deadline = new Date(findKandidat.votingDeadline);
    if (isNaN(deadline.getTime())) {
      return res.status(400).json({ message: "Format waktu tidak valid" });
    }
    deadline.setUTCDate(deadline.getUTCDate() - startValue);

    const currentTime = new Date();

    if (currentTime.setUTCHours(currentTime.getUTCHours() + 7) <= deadline) {
      try {
        await Kandidat.updateMany(
          { terdaftar: true, kategori: "BEM" },
          { votingStart: deadline }
        );
        return res.status(200).json({
          message: "Set Start Deadline Berhasil di Set Disemua Kandidat",
        });
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Gagal Mengset Set Start Deadline" });
      }
    } else {
      await Kandidat.updateMany(
        { terdaftar: true, kategori: "BEM" },
        { terdaftar: false, votingStart: null }
      );
      return res
        .status(200)
        .json({ message: "Set Start Deadline Telah Terlewat" });
    }
  }
});

// Set start voting HIMA
const setStartVoteHIMA = asyncHandler(async (req, res) => {
  const startValue = req.body.startVote;

  const findKandidat = await Kandidat.findOne({
    prodi: req.user.prodi,
    kategori: "HIMA",
    terdaftar: true,
  });

  if (!findKandidat) {
    return res.status(404).json({ message: "Kandidat Tidak Ada" });
  }

  if (!startValue) {
    return res.status(400).json({ message: "Nilai deadline tidak valid" });
  }

  const deadline = new Date(findKandidat.votingDeadline);

  if (isNaN(deadline.getTime())) {
    return res.status(400).json({ message: "Format waktu tidak valid" });
  }
  deadline.setUTCDate(deadline.getUTCDate() - startValue);
  const currentTime = new Date();

  if (currentTime.setUTCHours(currentTime.getUTCHours() + 7) <= deadline) {
    try {
      await Kandidat.updateMany(
        { terdaftar: true, kategori: "HIMA", prodi: req.user.prodi },
        { votingStart: deadline }
      );
      return res
        .status(200)
        .json({ message: "Deadline Berhasil di Set Disemua Kandidat" });
    } catch (error) {
      return res.status(500).json({ message: "Gagal Mengset Deadline" });
    }
  } else {
    await Kandidat.updateMany(
      { terdaftar: true, kategori: "HIMA", prodi: req.user.prodi },
      { terdaftar: false, votingStart: null }
    );
    return res.status(200).json({ message: "Deadline Telah Terlewat" });
  }
});

module.exports = {
  createKandidatBEM,
  getAllKandidat,
  getAKandidat,
  getAllKandidatBEM,
  getAllKandidatHIMA,
  deleteAKandidatHIMA,
  deleteAKandidatBEM,
  updateAKandidatBEM,
  updateAKandidatHIMA,
  setDeadlineVoteHIMA,
  setDeadlineVoteBEM,
  createKandidatHIMA,
  setStartVoteBEM,
  setStartVoteHIMA,
};
