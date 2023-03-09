import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destDir = "public/assets";

    if (req.baseUrl === "/posts") destDir += "/posts";
    else if ((req.baseUrl === "/auth") | (req.baseUrl === "/users")) destDir += "/avatars";

    const isExists = fs.existsSync(destDir);
    if (!isExists) fs.mkdirSync(destDir);

    cb(null, destDir);
  },

  filename: function (req, file, cb) {
    const fileName = file.originalname.split(".");
    fileName[0] = uuidv4();

    cb(null, fileName.join("."));
  },
});

const upload = multer({ storage });

export const uploadPicture = upload.single("picture");
