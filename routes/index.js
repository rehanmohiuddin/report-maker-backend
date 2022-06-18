const { multipleUpload } = require("../Config/file-upload");
const { auth, checkAuth } = require("../views/Auth");
const {
  createReport,
  getReport,
  getReports,
  generateReport,
  deleteReport,
} = require("../views/Report");

const router = require("express").Router();

router.post("/report", multipleUpload, createReport);
router.get("/report", getReport);
router.delete("/report", deleteReport);
router.get("/reports", getReports);
router.post("/generate/report", generateReport);
router.post("/auth", auth);
router.get("/check/auth", checkAuth);

module.exports = router;
