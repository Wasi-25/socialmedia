import { Avatar, Button, Typography, Dialog } from "@mui/material";
import React, { useEffect } from "react";
import {
  MoreVert,
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  DeleteOutline,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import "./Post.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCommentOnPost,
  deletePost,
  likePost,
  updatePost,
} from "../../Actions/Post";
import { getFollowingPosts, getMyPosts, loadUser } from "../../Actions/User";
import User from "../User/User";
import CommentCard from "../CommentCard/CommentCard";

const Post = ({
    postId,
    caption,
    postImage,
    likes = [],
    comments = [],
    ownerImage,
    ownerName,
    ownerId,
    createdAt,
    isDelete = false,
    isAccount = false,
}) => {
  const [liked, setLiked] = useState(false);
  const [likesUser, setLikesUser] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [commentToggle, setCommentToggle] = useState(false);
  const [captionValue, setCaptionValue] = useState(caption);
  const [captionToggle, setCaptionToggle] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // DATE
  var h1 = Number(createdAt[11] - '0');
    var h2 = Number(createdAt[12] - '0');
    var hh = h1 * 10 + h2;
      
      hh= hh + 5; 
      hh %= 12;

      if(hh<10){
        hh="0"+hh;
      }


      var min1 = Number(createdAt[14]-'0');
      var min2 = Number(createdAt[15]-'0');
    
      var min = min1 * 10 + min2;
      
      min = min + 30;
    
      if(min===60){
        min = 0;
        hh+=1;
      }
      if(min>=60){
        min%=60;
        hh+=1;
      }
      if(min<10){
        min="0"+min;
      }

      var Meridien;
      if (hh < 12) {
        Meridien = "AM";
      }
      else
        Meridien = "PM";


      const months =["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
      var month= Number(createdAt.substring(5,7));

      var mm = months[month-1];
      

// END OF DATE

  const handleLike = async ()=>{
      setLiked(!liked);
      await dispatch(likePost(postId));
      if(isAccount){
        dispatch(getMyPosts());
      }else{
        dispatch(getFollowingPosts());
      }
  };

  const addCommentHandler = async (e) => {
    e.preventDefault();
    await dispatch(addCommentOnPost(postId, commentValue));

    if (isAccount) {
      dispatch(getMyPosts());
    } else {
      dispatch(getFollowingPosts());
    }
  };

  const updateCaptionHandler = (e) => {
    e.preventDefault();
    dispatch(updatePost(captionValue, postId));
    dispatch(getMyPosts());
  };

  const deletePostHandler = async () => {
    await dispatch(deletePost(postId));
    dispatch(getMyPosts());
    dispatch(loadUser());
  };

  useEffect(() => {
    likes.forEach((item) => {
      if (item._id === user._id) {
        setLiked(true);
      }
    });
  }, [likes, user._id]);


  return (
    <div className='post'>
        <div className="postHeader">
        {isAccount ? (
          <Button onClick={() => setCaptionToggle(!captionToggle)}>
            <MoreVert />
          </Button>
        ) : null}
        </div>
        <img src={postImage} alt="Post" />
        <div className="postDetails">
        <Avatar
          src={ownerImage}
          alt="User"
          sx={{
            height: "3vmax",
            width: "3vmax",
            alignSelf: 'center'
          }}
        />
                <Link to={`/user/${ownerId}`}>
          <Typography fontFamily='Tilt Neon' fontWeight={700}>{ownerName}</Typography>
        </Link>

        <Typography fontFamily='Roboto'
          fontWeight={500}
          color="rgba(0, 0, 0, 0.7)"
          style={{ alignSelf: "center", marginLeft:"5px", overflow:"hidden"}}
        >
          {caption}
        </Typography>

        <div className="typodiv">
          <span fontFamily='Tilt Neon' style={{opacity:"50%",fontSize:"13px", color:"#000"}}>{createdAt.substring(8,10)}/{mm}/{createdAt.substring(0,4)} | {hh}:{min} {Meridien}
        </span>
        </div>
        </div>

        <button style={{
          border: "none",
          backgroundColor: "white",
          cursor: "pointer",
          margin: "1vmax 2vmax",
        }}
        onClick={()=>setLikesUser(!likesUser)}
        disabled={likes.length === 0 ? true : false}>
        <Typography fontFamily='Tilt Neon'>{likes.length} Likes</Typography>
        </button>

        <div className="postFooter">
            <Button onClick={handleLike}>
            {liked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />}
            </Button>

            <Button>
                <ChatBubbleOutline  onClick={()=>setCommentToggle(!commentToggle)}/>
            </Button>

            {isDelete ? (
              <Button onClick={deletePostHandler}>
            <DeleteOutline />
          </Button>
        ) : null}
        </div>
        <Dialog open={likesUser} onClose={() => setLikesUser(!likesUser)}>
        <div className="DialogBox">
          <Typography variant="h4" fontFamily='Tilt Neon'>Liked By</Typography>

          {likes.map((like) => (
            <User
              key={like._id}
              userId={like._id}
              name={like.name}
              avatar={like.avatar.url}
            /> 
          ))}
        </div>
      </Dialog>
      <Dialog
        open={commentToggle}
        onClose={() => setCommentToggle(!commentToggle)}
      >
        <div className="DialogBox">
          <Typography fontFamily='Tilt Neon' variant="h4">Comments</Typography>

          <form className="commentForm" onSubmit={addCommentHandler}>
            <input
              type="text"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              placeholder="Comment Here..."
              fontFamily='Tilt Neon'
              required
            />

            <Button fontFamily='Tilt Neon' type="submit" variant="contained">
              Add
            </Button>
          </form>

          {comments.length > 0 ? (
            comments.map((item) => (
              <CommentCard
                userId={item.user._id}
                name={item.user.name}
                avatar={item.user.avatar.url}
                comment={item.comment}
                commentId={item._id}
                key={item._id}
                postId={postId}
                isAccount={isAccount}
              />
            ))
          ) : (
            <Typography fontFamily='Tilt Neon'>No comments Yet</Typography>
          )}
        </div>
      </Dialog>

      <Dialog
        open={captionToggle}
        onClose={() => setCaptionToggle(!captionToggle)}
      >
        <div className="DialogBox">
          <Typography fontFamily='Tilt Neon' variant="h4">Update Caption</Typography>

          <form className="commentForm" onSubmit={updateCaptionHandler}>
            <input
              type="text"
              value={captionValue}
              fontFamily='Tilt Neon'
              onChange={(e) => setCaptionValue(e.target.value)}
              placeholder="Caption Here..."
              required
            />

            <Button fontFamily='Tilt Neon' type="submit" variant="contained">
              Update
            </Button>
          </form>
        </div>
      </Dialog>

    </div>
  )
}

export default Post