import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  refreshToken: { type: String, required: true },
});

const Token = mongoose.model("Token", TokenSchema);
export default Token;
