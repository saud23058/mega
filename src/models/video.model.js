import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = mongoose.Schema({
  videoFile: {
    type: String,
    required: true,
    
  },
  thumbnail: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,  //we will take it from cloudinary because it sends the full info about video
    required: true,
  },

  views: {
    type: Number,
    default:0
  },
  isPublished: {
    type: Boolean,
    default:true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
}, { timestamps: true });

videoSchema.plugin(mongooseAggregatePaginate)

const Video = mongoose.model("Video", videoSchema);

export default Video;
