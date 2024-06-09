import { useMutation,gql, useQuery } from '@apollo/client';
import { Avatar, Button, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router';
import { IS_FOLLOWING_QUERY } from '../../Graphql/GraphqlQuery'
import { ADD_FOLLOWER_MUTATION , UNFOLLOW_MUTATION, SEARCH_USERS_MUTATION } from '../../Graphql/GraphqlMutation'
import { toast } from 'react-toastify';

const api = process.env.REACT_APP_MEDIA_API;



function SearchResult() {
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');
  const [searchUsers, { loading, error, data }] = useMutation(SEARCH_USERS_MUTATION);
  const userBio = data?.searchUsers.matchingUsers || {};
  const navigate = useNavigate()

  useEffect(() => {
    if (searchQuery) {
      searchUsers({ variables: { search: searchQuery } })
        .then(({ data }) => {
          setSearchResults(data.searchUsers.matchingUsers);
        })
        .catch((error) => {
          if (error.message === "User is not active" || error.message === "Invalid token or user not found") {
            navigate('/login')
          }
          console.error('Error fetching search results:', error);
        });
    }
  }, [searchQuery, searchUsers]);

  return ( 
<div>
  {searchResults.length === 0 ? (
    <Typography variant="h5">No such user</Typography>
  ) : (
    <List sx={{ width: '100%', maxWidth: 660, bgcolor: 'background.paper', m:0 }}>
    {searchResults.map((user) => (
    <React.Fragment key={user.id}>
      <ListItem alignItems="center" justifyContent="center">
        <ListItemAvatar sx={{mr:2}}>
          <Avatar alt="" src={`${api}${user.profilePicture}`} 
            sx={{ width:40,height:40}}
            onClick = {() => navigate(`/${user.username}`)}
          />
          
        </ListItemAvatar>
        <ListItemText
            primary={
              <Button onClick={() => navigate(`/${user.username}`)}>
                {`${user.firstName} ${user.lastName}`}
              </Button>
            }
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {user.username}
              </Typography>
            </React.Fragment>
          }
          />

            <FollowButton user={user} />
      </ListItem>
      <Divider variant="inset" component="li" />
    </React.Fragment>
    ))}
    </List>
  )}
  </div>
  )
}


export function FollowButton({ user }) {
  const [addFollower, {data:addFollowerData}] = useMutation(ADD_FOLLOWER_MUTATION)
  const [removeFollower,{data:removeFollowerData}] = useMutation(UNFOLLOW_MUTATION)

  const {data: isFollows, refetch: refetch_isFollows} = useQuery(IS_FOLLOWING_QUERY, { variables: {followingId: user.id}});
  const isFollowing = isFollows ? isFollows.isFollowing : false;

  const handleFollow = async () => {
    const userIdToFollow = user.id;
    try {
      await addFollower({ variables: { id: userIdToFollow } });
      refetch_isFollows();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUnfollow = async () => {
    const userIdToUnfollow = user.id;
    try {
      await removeFollower({ variables: { id: userIdToUnfollow } });
      refetch_isFollows();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <React.Fragment>
      {isFollowing ? (
        <Button variant="outlined" size="small" onClick={handleUnfollow} 
          sx={{ borderRadius: '50px', width: 'fit-content', '&:hover': { cursor: 'pointer' } }}>
          unfollow
        </Button>
      ) : (
        <Button variant="contained" size="small" color="primary" onClick={handleFollow} 
          sx={{ borderRadius: '50px', width: '100px', '&:hover': { cursor: 'pointer' } }}>
        follow
        </Button>
      )}
    </React.Fragment>
  );
}



export default SearchResult