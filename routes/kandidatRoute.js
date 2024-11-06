const express = require("express");
const {
  createKandidatBEM,
  getAllKandidat,
  getAKandidat,
  getAllKandidatBEM,
  getAllKandidatHIMA,
  updateAKandidatBEM,
  setDeadlineVoteHIMA,
  setDeadlineVoteBEM,
  createKandidatHIMA,
  setStartVoteBEM,
  setStartVoteHIMA,
  updateAKandidatHIMA,
  deleteAKandidatHIMA,
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
router.get("/get/:id", authMiddleware, getAKandidat);
router.delete("/hima/:id", authMiddleware, isAdminHima, deleteAKandidatHIMA);
router.delete("/bem/:id", authMiddleware, isAdminBem, deleteAKandidatBEM);
router.put("/update/bem/:id", authMiddleware, isAdminBem, updateAKandidatBEM);
router.put(
  "/update/hima/:id",
  authMiddleware,
  isAdminHima,
  updateAKandidatHIMA
);

module.exports = router;
