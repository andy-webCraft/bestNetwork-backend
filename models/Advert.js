import mongoose from "mongoose";

const AdvertSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    link: { type: String, required: true },
    description: { type: String, required: true },
    picturePath: { type: String, required: true },
  },
  {
    statics: {
      getCount() {
        return this.countDocuments();
      },
    },
  }
);

const Advert = mongoose.model("Advert", AdvertSchema);
export default Advert;
