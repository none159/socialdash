import React, { useEffect, useState } from "react";
import Posts from "../models/posts";

interface PostType {
  _id: string;
  groupId: string;
  text: string;
  image:string;
  userId: string;
  createdAt: Date;
}

interface CommentType {
  _id: string;
  groupId:string;
  postId:string;
  userId: string;
  comment: string;
  likes:number;
  createdAt: Date;
}

interface User {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  image?: string;
}

const Post: React.FC<{ post: PostType }> = ({ post }) => {
  const { _id, text, groupId, userId, createdAt,image } = post;
  const [showcomments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [user, setUser] = useState<User>();
  const [liked, setLiked] = useState(false); // Track if the post is liked
  const [likeCount, setLikeCount] = useState(0); // Track the number of likes
  const [commentLikes, setCommentLikes] = useState();
  const [likedComments, setLikedComments] = useState()

  const handleLike = async () => {
    const newLikeState = !liked; // Toggle the like state
    setLiked(newLikeState); // Optimistically update the like state
  
    const action = newLikeState ? "like" : "unlike"; // Determine the action based on the new state
  
    try {
      // Call to backend to update like status
      const res = await fetch("/api/posts/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: _id,groupId, action }), // Include action in the request
      });
  
      if (res.ok) {
        // If successful, update the like count from the server
        const data = await res.json();
        setLikeCount(data.likes); // Assuming the backend returns the updated like count
      } else {
        console.error("Failed to handle like");
        setLiked(!newLikeState); // Revert the like state if there was an error
      }
    } catch (error) {
      console.error("Error while handling like:", error);
      setLiked(!newLikeState); // Revert the like state in case of an exception
    }
  };
  const handleCommentLike = async (commentId: string) => {
    const newLikeState = !likedComments![commentId] // Toggle the like state for the comment


    const action = newLikeState ? "like" : "unlike";
    console.log(action)
    try {
      const res = await fetch("/api/posts/comments/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId, postId: _id, action,groupId }),
      });

      if (res.ok) {
        const data = await res.json();
      

      } else {
        console.error("Failed to handle comment like");
       // Revert on error
      }
    } catch (error) {
      console.error("Error while handling comment like:", error);
    
    }
  };
  const fetchCommentLikeStatus = async (Comments: any) => {
    try {
      if (Comments.length > 0) {
        console.log("Fetching like statuses...");
        
        // Objects to store like statuses and counts
        const likeStatuses: any = {};
        const likeCounts: any = {};
        
        // Use Promise.all to fetch all like statuses concurrently
        await Promise.all(
          Comments.map(async (c: any) => {
            if (c._id !== undefined) {
              const res = await fetch(`/api/posts/comments/likes?commentId=${c._id}`);
              if (!res.ok) {
                throw new Error(`Failed to fetch status for comment ID: ${c._id}`);
              }
              const data = await res.json();
              const commentId = c._id;
              likeStatuses[commentId] = data.isliked; // Map ID to like status
              likeCounts[commentId] = data.likes;  
            }
          })
        );
        
        // Update state after all requests are complete
        setLikedComments(likeStatuses);
        setCommentLikes(likeCounts);
      }
    } catch (error) {
      console.error("Error fetching comment like status:", error);
    }
  };

  const fetchUser = async () => {
    const res = await fetch("/api/profile");
    if (res.ok) {
      const data = await res.json();
      setUser(data.message);

    }
  };
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const res = await fetch(`/api/posts/likes?postId=${_id}`);
        if (res.ok) {
          const data = await res.json();

          setLiked(data.liked); 
          setLikeCount(data.likes);
           // Update the like count
        } else {
          console.error("Failed to fetch like status");
        }
      } catch (error) {
        console.error("Error while fetching like status:", error);
      }
    };
    const int = setInterval(()=>{
    fetchLikeStatus();
    },3000)
    return ()=>clearInterval(int)
  }, [_id]);
  
  const fetchComments = async () => {

    const res = await fetch(`/api/posts/comments?postId=${_id}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.comments)&&data.comments) {

      setComments(data.comments);
      fetchCommentLikeStatus(data.comments)
      }
    } else {
      console.error("Failed to fetch comments");
    }
  };
  const handleShare = async () => {
    try {
      const postLink = `${window.location.origin}/posts/${_id}`; // Construct the post link
      await navigator.clipboard.writeText(postLink); // Copy the link to clipboard
      alert("Post link copied to clipboard!"); // Notify the user
    } catch (error) {
      console.error("Error while sharing the post:", error);
      alert("Failed to copy the link. Please try again.");
    }
  };
  useEffect(() => {
    fetchUser();
  }, [showcomments]);

  useEffect(() => {
    const int = setInterval(() => {
      fetchComments();
    }, 3000);
    return () => clearInterval(int);
  }, []);

  const handleComment = async () => {
    const res = await fetch("/api/posts/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id, groupId, comment }),
    });

    if (res.ok) {
      setComment(""); // Reset the comment input
    } else {
      console.error("Failed to add comment");
    }
  };

  return ( <div className="mb-[100px] p-6 bg-gray-800  text-white shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-300">
    {/* Header Section */}
    <div className=" flex items-center mb-4">
      <img
        src={user ? user.image : ""}
        className="w-10 h-10 bg-gray-600 rounded-full flex-shrink-0 mr-3"
      />
      <div>
        <h3 className="text-lg font-semibold">{userId}</h3>
        <span className="text-sm text-gray-400">
          {new Date(createdAt).toLocaleString()}
        </span>
      </div>
    </div>

    {/* Post Content */}
    
    <p className="text-gray-300 mb-4">{text}</p>
    {image && (
  <img
    src={image}
    className="w-[500px] h-[400px] rounded my-5 object-contain"
    alt="Uploaded"
  />
)}


    {/* Footer Section */}
    <div className="flex justify-between items-center text-gray-400">
    <button
  onClick={handleLike}
  className="flex items-center space-x-2 hover:text-gray-200 transition"
>
  <span>{likeCount}</span>
  {liked ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="red"
      viewBox="0 0 24 24"
      className="w-6 h-6 transition-transform duration-300 transform scale-125"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3a5.49 5.49 0 014.5 2.09A5.49 5.49 0 0116.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21z"
      />
    </svg>
  )}
</button>
<button
    onClick={() => setShowComments(!showcomments)}
    className="flex items-center space-x-1 hover:text-gray-500 transition"
  >
    {/* Instagram-like Comment Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
    >
      <path
        d="M12 3C6.48 3 2 6.91 2 11.5c0 2.5 1.5 4.72 3.92 6.19v3.31c0 .37.28.69.65.74.11.02.22.02.32-.02l3.38-1.14c.92.17 1.88.27 2.89.27 5.52 0 10-3.91 10-8.5S17.52 3 12 3zm-3 9h6c.55 0 1-.45 1-1s-.45-1-1-1H9c-.55 0-1 .45-1 1s.45 1 1 1zm0-4h6c.55 0 1-.45 1-1s-.45-1-1-1H9c-.55 0-1 .45-1 1s.45 1 1 1z"
      />
    </svg>
    <span>Comment</span>
  </button>

  {/* Share Button */}
  <button
    onClick={handleShare}
    className="flex items-center space-x-1 hover:text-gray-500 transition"
  >
    {/* Instagram-like Share Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
    >
      <path
        d="M18 16.08c-.76 0-1.45.3-1.96.77l-7.12-3.73a2.99 2.99 0 000-1.85l7.12-3.73A2.997 2.997 0 1014 6c0 .33.05.64.14.94L7.03 10.7a2.997 2.997 0 100 2.6l7.11 3.76c-.08.3-.13.61-.13.94 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"
      />
    </svg>
    <span>Share</span>
  </button>

    </div>

    {/* Comment Section */}
    {showcomments && (
        <div className={`mt-4 transform transition-transform duration-500 ease-out ${
          showcomments ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`} >
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="mt-2 p-2 bg-gray-700 text-black rounded-md w-full"
          />
          <button
            onClick={handleComment}
            className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Post Comment
          </button>
          <div className="mt-4">
            {comments.length > 0 ? (
            comments.map((comment) => (
                 <div
                key={comment._id}
                className="flex items-start justify-between p-3 bg-gray-700 text-white rounded-md mt-2"
              >
                <div>
                  <p className="text-sm text-gray-300">{comment.comment}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <button
  onClick={() => handleCommentLike(comment._id)}
  className="flex items-center space-x-2 hover:text-gray-200 transition"
>
  <span>{commentLikes?.[comment._id] || 0}</span>
  {likedComments?.[comment._id] ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="red"
      viewBox="0 0 24 24"
      className="w-6 h-6 transition-transform duration-300 transform scale-125"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3a5.49 5.49 0 014.5 2.09A5.49 5.49 0 0116.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21z"
      />
    </svg>
  )}
</button>
              </div>
              ))):(
                <p className="text-gray-400">No comments yet.</p>
              )}
          </div>
        </div>
  
       
    )}
  </div>
);
};

export default Post;
