import React, { useEffect, useState } from "react";
import Image from 'next/image';

interface PostType {
  _id: string;
  groupId: string;
  text: string;
  image: string;
  userId: string;
  createdAt: Date;
}

interface CommentType {
  _id: string;
  groupId: string;
  postId: string;
  userId: string;
  comment: string;
  likes: number;
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
  const { _id, text, groupId, userId, createdAt, image } = post;
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>({});
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});

  const handleLike = async () => {
    const newLikeState = !liked;
    setLiked(newLikeState);

    const action = newLikeState ? "like" : "unlike";

    try {
      const res = await fetch("/api/posts/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: _id, groupId, action }),
      });

      if (res.ok) {
        const data = await res.json();
        setLikeCount(data.likes);
      } else {
        console.error("Failed to handle like");
        setLiked(!newLikeState);
      }
    } catch (error) {
      console.error("Error while handling like:", error);
      setLiked(!newLikeState);
    }
  };

  const handleCommentLike = async (commentId: string) => {
    const newLikeState = !likedComments[commentId];
    setLikedComments((prev) => ({ ...prev, [commentId]: newLikeState }));

    const action = newLikeState ? "like" : "unlike";

    try {
      const res = await fetch("/api/posts/comments/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, postId: _id, action, groupId }),
      });

      if (res.ok) {
        const data = await res.json();
        setCommentLikes((prev) => ({ ...prev, [commentId]: data.likes }));
      } else {
        console.error("Failed to handle comment like");
      }
    } catch (error) {
      console.error("Error while handling comment like:", error);
    }
  };

  const fetchUser = async () => {
    const res = await fetch("/api/profile");
    if (res.ok) {
      const data = await res.json();
      setUser(data.message);
    }
  };

  const fetchComments = async () => {
    const res = await fetch(`/api/posts/comments?postId=${_id}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.comments)) {
        setComments(data.comments);
        fetchCommentLikeStatus(data.comments);
      }
    } else {
      console.error("Failed to fetch comments");
    }
  };

  const fetchCommentLikeStatus = async (comments: CommentType[]) => {
    try {
      const likeStatuses: Record<string, boolean> = {};
      const likeCounts: Record<string, number> = {};

      await Promise.all(
        comments.map(async (c) => {
          if (c._id) {
            const res = await fetch(`/api/posts/comments/likes?commentId=${c._id}`);
            if (!res.ok) {
              throw new Error(`Failed to fetch status for comment ID: ${c._id}`);
            }
            const data = await res.json();
            likeStatuses[c._id] = data.isliked;
            likeCounts[c._id] = data.likes;
          }
        })
      );

      setLikedComments(likeStatuses);
      setCommentLikes(likeCounts);
    } catch (error) {
      console.error("Error fetching comment like status:", error);
    }
  };

  const handleComment = async () => {
    const res = await fetch("/api/posts/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: _id, groupId, comment }),
    });

    if (res.ok) {
      setComment("");
      fetchComments(); // Update comments after posting
    } else {
      console.error("Failed to add comment");
    }
  };

  const handleShare = async () => {
    try {
      const postLink = `${window.location.origin}/posts/${_id}`;
      await navigator.clipboard.writeText(postLink);
      alert("Post link copied to clipboard!");
    } catch (error) {
      console.error("Error while sharing the post:", error);
      alert("Failed to copy the link. Please try again.");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchComments();
  }, [fetchComments]); // Ensure fetchComments is included as a dependency

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const res = await fetch(`/api/posts/likes?postId=${_id}`);
        if (res.ok) {
          const data = await res.json();
          setLiked(data.liked);
          setLikeCount(data.likes);
        } else {
          console.error("Failed to fetch like status");
        }
      } catch (error) {
        console.error("Error while fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [_id]);

  return (
    <div className="mb-[100px] p-6 bg-gray-800 text-white shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <Image
          src={user?.image || ""}
          className="w-10 h-10 bg-gray-600 rounded-full flex-shrink-0 mr-3"
          alt={user ? `${user.username}'s profile` : "User"}
        />
        <div>
          <h3 className="text-lg font-semibold">{userId}</h3>
          <span className="text-sm text-gray-400">
            {new Date(createdAt).toLocaleString()}
          </span>
        </div>
      </div>
      <p className="text-gray-300 mb-4">{text}</p>
      {image && (
        <Image
          src={image}
          className="w-[500px] h-[400px] rounded my-5 object-contain"
          alt="Uploaded"
        />
      )}
      <div className="flex justify-between items-center text-gray-400">
        <button onClick={handleLike} className="flex items-center space-x-2 hover:text-gray-200 transition">
          <span>{likeCount}</span>
          {liked ? "❤️" : "🤍"}
        </button>
        <button onClick={handleShare} className="hover:text-gray-200">
          Share
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 hover:text-gray-200 transition"
        >
          <span>{comments.length}</span>
          <span>Comments</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-6">
          <input
            type="text"
            placeholder="Add a comment..."
            className="w-full p-3 rounded-lg bg-gray-700 text-white mb-4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            onClick={handleComment}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Comment
          </button>

          {comments.map((comment) => (
            <div key={comment._id} className="mt-4 bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-200">{comment.userId}</span>
                <button onClick={() => handleCommentLike(comment._id)}>
                  {likedComments[comment._id] ? "❤️" : "🤍"} {commentLikes[comment._id]}
                </button>
              </div>
              <p className="text-gray-400 mt-2">{comment.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;
