import mongoose,{models, Schema} from "mongoose"


const CommentslikesSchema = new Schema({
  groupId: {
    type: String,
    ref: "Group",
    required: true,
  },
  commentId:{
    type: String,
    ref: "Comments",
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


const Commentslikes = models.Commentslikes || mongoose.model("Commentslikes", CommentslikesSchema);
export default Commentslikes;
