import fetch, { FormData } from "node-fetch";

export const imageService = {
  uploadImage: async (imageFile) => {
    const payload = new FormData();
    payload.append("image", imageFile.buffer.toString("base64"));

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMAGEBB_API_KEY}`,
      { method: "POST", body: payload }
    );
    const { data } = await response.json();

    return data.display_url;
  },
};
