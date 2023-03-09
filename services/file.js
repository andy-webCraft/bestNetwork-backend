import fs from "fs";

export const fileService = {
  getFullPath: (fileData) => `${fileData.destination.slice(7)}/${fileData.filename}`,

  getStorageFullUrl: (path) => `${process.env.SERVER_URL}:${process.env.PORT}/${path}`,

  deleteFromStorage: (picturePath) => {
    const fullPath = `public/${picturePath}`;
    const isExists = fs.existsSync(fullPath);

    if (!isExists) return false;

    fs.unlinkSync(fullPath);
  },
};
