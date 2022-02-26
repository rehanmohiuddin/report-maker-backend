const Report = require("../models/Report");
const Upload = require("../Config/Upload");
const streamifier = require("streamifier");
var pdf = require("pdf-creator-node");

const createReport = async (req, res) => {
  try {
    const sections = [];
    const Media = new Map();
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = Upload.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(buffer).pipe(stream);
      });
    };
    console.log("File Req", req.files);
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        let result = await streamUpload(req.files[i].buffer);
        // console.log(result);
        const deptName = file.originalname.split("-")[0];

        Media.has(deptName)
          ? Media.set(deptName, [result, ...Media.get(deptName)])
          : Media.set(deptName, [result]);
      }
    }
    // console.log("Files", Media);

    for (const key in req.body) {
      sections.push({
        name: key,
        description: JSON.stringify(req.body[key]),
        media: Media.get(key),
      });
    }
    const report = new Report({ sections: sections });
    await report.save();
    res.send({
      message: report,
    });
  } catch (e) {
    res.status(500).send({
      message: e.toString(),
    });
  }
};

const getReport = async (req, res) => {
  try {
    const { id } = req.query;
    const report = await Report.findOne({ _id: id });
    res.send({
      message: report,
    });
  } catch (e) {
    res.status(500).send({
      message: e.toString(),
    });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.send({
      message: reports,
    });
  } catch (e) {
    res.status(500).send({
      message: e.toString(),
    });
  }
};

const generateReport = async (req, res) => {
  const { content } = req.query;
};

module.exports = {
  createReport: createReport,
  getReport: getReport,
  getReports: getReports,
  generateReport: generateReport,
};
