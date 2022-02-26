const { multipleUpload } = require("../Config/file-upload");
const {
  createReport,
  getReport,
  getReports,
  generateReport,
} = require("../views/Report");

const router = require("express").Router();

router.post("/report", multipleUpload, createReport);
router.get("/report", getReport);
router.get("/reports", getReports);
// router.post("/generate/report", generateReport);

module.exports = router;
