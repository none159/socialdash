import mongoose,{models, Schema} from "mongoose"

const groupMessageSchema = new Schema({
    groupId: {
      type: String,
      ref:"Group",
      required: true, 
    },
     userId: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
      },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  });
const GroupMessage = models.GroupMessage || mongoose.model("GroupMessage",groupMessageSchema)

export default GroupMessage;