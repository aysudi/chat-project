import mongoose from "mongoose";
import messageSchema from "../schemas/messageSchema.js";

const MessageModel = mongoose.model("Message", messageSchema);

export default MessageModel;
