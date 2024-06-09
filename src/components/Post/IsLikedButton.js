import React from 'react';
import {  Typography } from '@mui/material';
import { toast } from 'react-toastify';
import {  useQuery,gql, useMutation } from '@apollo/client';
import {  Favorite, FavoriteBorder } from '@mui/icons-material';
import { IS_LIKED_QUERY, TOTAL_LIKES_QUERY } from '../../Graphql/GraphqlQuery'
import {  LIKE_POST } from '../../Graphql/GraphqlMutation'



export function IsLikedButton({ postId }){
    const {data:isLikedData, refetch:isLikedRefetch} = useQuery(IS_LIKED_QUERY, {
      variables : { postId: postId}
    })
    const isLikedPost = isLikedData? isLikedData.isLiked : false;
  
    const {data: totalLikesData, refetch: totalLikesRefetch} = useQuery(TOTAL_LIKES_QUERY, {
      variables : {postId : postId}
    })
    const totalLikesCount = totalLikesData?.totalLikesForPost
  
    const [likePostMutation, {data: likePostData}] =  useMutation(LIKE_POST)
  
    const handleLikePost = async (postId) => {
      try{
        const response = await likePostMutation({
          variables : {
            postId :postId
          }
        })
        if (response.data.likePost.success){
          isLikedRefetch()
          totalLikesRefetch()
        }
      }catch(error){
        toast.error(error.message)
      }
  
    }
  
  
    return (
      <React.Fragment>
        {isLikedPost ? (
            <Favorite color="error" sx={{ marginRight: '4px', cursor: 'pointer' }} onClick={() => handleLikePost(postId)} />
          ) : (
            <FavoriteBorder sx={{ marginRight: '4px', cursor: 'pointer' }} onClick={() => handleLikePost(postId)} />
          )}
          <Typography variant="body2">{totalLikesCount} likes</Typography>
      </React.Fragment>
    )
  }