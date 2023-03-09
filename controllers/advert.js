import Advert from "../models/Advert.js";

/* GET RANDOM ADVERT */
export const getRandomAdvert = async (req, res, next) => {
  try {
    const count = await Advert.getCount();
    const random = Math.floor(Math.random() * count);

    const advert = await Advert.findOne().skip(random);

    res.status(200).json({ advert });
  } catch (error) {
    next(error);
  }
};
