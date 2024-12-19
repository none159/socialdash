import mongoose,{models, Schema} from "mongoose"

const groupSchema = new Schema({
    creator: {
      type: String,
      required:true,
      trim: true, 
    },
    title: {
      type: String,
      required:true,
      trim: true, 
    },
    description: {
      type: String,
      required:true,
      trim: true, 
    },
    image:{
      type: String

    },
    roomId: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  });
const Group = models.Group || mongoose.model("Group",groupSchema)

export default Group;