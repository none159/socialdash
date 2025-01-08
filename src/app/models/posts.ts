import mongoose,{models, Schema} from "mongoose"


const PostsSchema = new Schema({
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
  text: {
    type: String,
    required: true,
    trim: true,
  },
  image:{
    type:String,
    default:''
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Posts = models.Posts || mongoose.model("Posts", PostsSchema);
export default Posts;
