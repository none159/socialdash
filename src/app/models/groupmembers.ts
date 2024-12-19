import mongoose,{models, Schema} from "mongoose"

const groupMemberSchema = new Schema({
    userId: {
      type: String,
      trim: true, 
    },
     groupId: {
      type: String,
      required: true,
      ref:"Group", 

    },
    joinedAt: {
        type: Date,
        default: Date.now,
      },
   Role: {
      type:String,
      enum: ["admin","moderator","VIP","member"],
      default:"member"
    }
  });
const GroupMember = models.GroupMember || mongoose.model("GroupMember",groupMemberSchema)

export default GroupMember;