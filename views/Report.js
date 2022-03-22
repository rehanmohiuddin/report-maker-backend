const Report = require("../models/Report");
const Upload = require("../Config/Upload");
const streamifier = require("streamifier");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const { default: axios } = require("axios");
const { getWeekDay } = require("../Config/Util");
const getStream = require("get-stream");

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
async function fetchImage(src) {
  const image = await axios.get(src, {
    responseType: "arraybuffer",
  });
  return image.data;
}

const generateReport = async (req, res) => {
  const { sections, date, _id } = req.body;
  const doc = new PDFDocument({
    layout: "portrait",
  });

  doc.fontSize(12);
  // doc.text("Al Sami Agro ", {
  //   width: 410,
  //   align: "center",
  // });
  doc
    .image("PdfTemplate/3636.png", 10, 0, { width: 150 })
    .fillColor("#444444")
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("Al Sami Agro Products Pvt Ltd", { align: "center" })
    .moveDown(1)
    .fontSize(12)
    .text("Daily Reports By Mohd Masood Ali", { align: "center" })
    .moveDown(1)
    .text(`Date : ${new Date(date).toLocaleDateString()}`, { align: "center" })
    .moveDown(1)
    .text(` Day : ${getWeekDay(new Date(date).getDay())}`, { align: "center" })
    .fontSize(12)
    .moveDown(2);

  await Promise.all(
    sections.map(async (_section) => {
      let itemPos = 0;
      doc.fontSize(20);
      doc.text(_section.name, {
        align: "center",
      });
      doc.moveDown(1);
      doc.fontSize(15).font("Helvetica");
      doc.text(_section.description, {
        width: 465,
        align: "justify",
      });
      doc.moveDown(2);

      // await Promise.all(
      if (_section.media) {
        doc.fontSize(17);
        doc.text("Check Out Images At", {
          align: "center",
        });
        doc.moveDown(1);
        doc.fontSize(15);
        doc.text(
          `https://masood-ali.netlify.app/Images/${_id}?section_id=${_section._id}`,
          {
            align: "center",
          }
        );
        doc.moveDown(1);
      }
      doc.fillColor("#444444").fontSize(20).font("Helvetica-Bold");
    })
  );
  doc.end();
  // doc.pipe(res);
  const pdfBuffer = await getStream.buffer(doc);
  res.send(pdfBuffer.toString("base64"));
};

module.exports = {
  createReport: createReport,
  getReport: getReport,
  getReports: getReports,
  generateReport: generateReport,
};
