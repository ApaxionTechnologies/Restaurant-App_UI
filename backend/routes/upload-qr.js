import express from "express";
import multer from "multer";
import * as Jimp from "jimp";

import QRCodeReader from "qrcode-reader";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload-qr", upload.single("file"), async (req, res) => {
  try {
    const image = await Jimp.read(req.file.path);
    const qr = new QRCodeReader();

    qr.callback = (err, value) => {
      if (err || !value) {
        return res.status(400).json({ error: "Could not decode QR" });
      }

      try {
        const data = JSON.parse(value.result);
        res.json(data);
      } catch {
        res.status(400).json({ error: "Invalid QR format" });
      }
    };

    qr.decode(image.bitmap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
