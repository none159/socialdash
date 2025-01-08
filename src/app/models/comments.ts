import mongoose,{models, Schema} from "mongoose"


const CommentsSchema = new Schema({
    groupId: {
      type: String,
      ref:"group",
      required: true, 
    },
    postId:{
        type:String,
        ref:"posts",
        requierd:true
    },
     userId: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
        type: String,
        required: true,
        trim: true,
      },
      likes: {
        type: Number,
        default: 0,
      },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  });
const Comments = models.Comments || mongoose.model("Comments",CommentsSchema)

export default Comments;