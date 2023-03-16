import { Button, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import "./CommentCard.css";
import { Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from 'react-redux';
import { getFollowingPosts, getMyPosts } from '../../Actions/User';
import { deleteCommentOnPost } from '../../Actions/Post';


const CommentCard = ({
    userId,
    name,
    avatar,
    comment,
    commentId,
    postId,
    isAccount,
}) => {

    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const deleteCommentHandle = () => {
        dispatch(deleteCommentOnPost(postId, commentId));
    
        if (isAccount) {
          dispatch(getMyPosts());
        } else {
          dispatch(getFollowingPosts());
        }
      };


  return (
    <div className='commentUser'>


        <Link to={`/user/${userId}`}>
            <img src={avatar} alt={name} />
            <Typography fontFamily='Tilt Neon' style={{ minWidth: "6vmax" }}>{name}</Typography>
        </Link>
        <Typography fontFamily='Tilt Neon' style={{marginLeft:"9px", width:"60%", wordWrap:"break-word"}}>{comment}</Typography>

        {
        isAccount ? (
                <Button onClick={deleteCommentHandle}>
                <Delete />
                </Button>
            ) : userId === user._id ? (
                <Button onClick={deleteCommentHandle}>
                <Delete />
                </Button>
            ) : null
            }

    </div>
  )
}

export default CommentCard;