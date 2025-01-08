import mongoose,{models, Schema} from "mongoose"


const LikesSchema = new Schema({
  groupId: {
    type: String,
    ref: "Group",
    required: true,
  },
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  postId: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Likes = models.Likes || mongoose.model("Likes", LikesSchema);
export default Likes;
