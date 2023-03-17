import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      min: 2,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 3,
      select: false,
    },
    picturePath: { type: String, default: "" },
    friends: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          get: (value) => value.toString(),
        },
      ],
      default: [],
    },
    location: { type: String, required: true },
    occupation: { type: String, default: "" },
    links: {
      github: { type: String, default: "" },
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
    viewedProfile: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    query: {
      getFriends() {
        return this.populate("friends", [
          "_id",
          "firstName",
          "lastName",
          "location",
          "picturePath",
        ]);
      },
      getPage(page, limit) {
        return this.skip((page - 1) * limit).limit(limit);
      },
      selectMainFields() {
        return this.select(["_id", "firstName", "lastName", "location", "picturePath"]);
      },
    },
    statics: {
      findByName(name) {
        return this.find().or([
          { firstName: new RegExp(name, "i") },
          { lastName: new RegExp(name, "i") },
        ]);
      },
      getUserPicturePath(userId) {
        return this.findById(userId, ["picturePath"]);
      },
    },
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
