const express = require("express");
const {
  createKandidatBEM,
  getAllKandidat,
  getAKandidat,
  getAllKandidatBEM,
  getAllKandidatHIMA,
  getAllKandidatDPP,
  updateAKandidatBEM,
  updateAKandidatDPP,
  setDeadlineVoteHIMA,
  setDeadlineVoteBEM,
  setDeadlineVoteDPP,
  createKandidatDPP,
  createKandidatHIMA,
  setStartVoteDPP,
  setStartVoteBEM,
  setStartVoteHIMA,
  updateAKandidatHIMA,
  deleteAKandidatHIMA,
  deleteAKandidatDPP,
  deleteAKandidatBEM,
} = require("../controllers/kandidatControllers");
const {
  authMiddleware,
  isAdmin,
  isAdminHima,
  isAdminBem,
  isAdminDpp,
} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register/bem", authMiddleware, isAdminBem, createKandidatBEM);
router.post("/register/dpp", authMiddleware, isAdminDpp, createKandidatDPP);
router.post("/register/hima", authMiddleware, isAdminHima, createKandidatHIMA);
router.post(
  "/set-deadline-vote/hima",
  authMiddleware,
  isAdminHima,
  setDeadlineVoteHIMA
);
router.post(
  "/set-deadline-vote/bem",
  authMiddleware,
  isAdminBem,
  setDeadlineVoteBEM
);
router.post(
  "/set-deadline-vote/dpp",
  authMiddleware,
  isAdminDpp,
  setDeadlineVoteDPP
);
router.post("/set-start-vote/dpp", authMiddleware, isAdminDpp, setStartVoteDPP);
router.post("/set-start-vote/bem", authMiddleware, isAdminBem, setStartVoteBEM);
router.post(
  "/set-start-vote/hima",
  authMiddleware,
  isAdminHima,
  setStartVoteHIMA
);
router.get("/get-all", authMiddleware, getAllKandidat);
router.get("/bem", authMiddleware, getAllKandidatBEM);
router.get("/hima", authMiddleware, getAllKandidatHIMA);
router.get("/dpp", authMiddleware, getAllKandidatDPP);
router.get("/get/:id", authMiddleware, getAKandidat);
router.delete("/hima/:id", authMiddleware, isAdminHima, deleteAKandidatHIMA);
router.delete("/bem/:id", authMiddleware, isAdminBem, deleteAKandidatBEM);
router.delete("/dpp/:id", authMiddleware, isAdminDpp, deleteAKandidatDPP);
router.put("/update/bem/:id", authMiddleware, isAdminBem, updateAKandidatBEM);
router.put("/update/dpp/:id", authMiddleware, isAdminDpp, updateAKandidatDPP);
router.put(
  "/update/hima/:id",
  authMiddleware,
  isAdminHima,
  updateAKandidatHIMA
);

module.exports = router;
