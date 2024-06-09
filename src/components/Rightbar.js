import { useQuery } from '@apollo/client'
import { Avatar, AvatarGroup, Box, Button, Divider, ImageList, ImageListItem, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { FRIEND_SUGGESTIONS } from '../Graphql/GraphqlQuery'
import { useNavigate } from 'react-router'
import { FollowButton } from './Search/SearchResult'

const api = process.env.REACT_APP_MEDIA_API;

function Rightbar() {
  const {loadig, error, data:friendSuggestionsData, refetch:friendSuggestionsRefetch} = useQuery(FRIEND_SUGGESTIONS)
  const navigate = useNavigate()

  useEffect(() => {
    friendSuggestionsRefetch();
  },[])

  return (
    <Box flex={2} p={1} m={1} sx={{ display: { xs: "none", sm: "block" } }} width='25%'>
      <Box width={250}>
        <Typography variant="h6" fontWeight={100}>
          Online Friends
        </Typography>
        <AvatarGroup max={7}>
          <Avatar
            alt="Remy Sharp"
            src=""
          />
          <Avatar
            alt="Travis Howard"
            src="https://material-ui.com/static/images/avatar/2.jpg"
          />
          <Avatar
            alt="Cindy Baker"
            src="https://material-ui.com/static/images/avatar/3.jpg"
          />
          <Avatar alt="Agnes Walker" src="" />
          <Avatar
            alt="Trevor Henderson"
            src="https://material-ui.com/static/images/avatar/6.jpg"
          />
          <Avatar
            alt="Trevor Henderson"
            src="https://material-ui.com/static/images/avatar/7.jpg"
          />
          <Avatar
            alt="Trevor Henderson"
            src="https://material-ui.com/static/images/avatar/8.jpg"
          />
          <Avatar
            alt="Trevor Henderson"
            src="https://material-ui.com/static/images/avatar/7.jpg"
          />
          <Avatar
            alt="Trevor Henderson"
            src="https://material-ui.com/static/images/avatar/8.jpg"
          />
        </AvatarGroup>
        <Typography variant="h6" fontWeight={100} mt={2} mb={2}>
          Latest Photos
        </Typography>
        <ImageList cols={3} rowHeight={100} gap={5}>
          <ImageListItem>
            <img
              src="https://material-ui.com/static/images/image-list/breakfast.jpg"
              alt=""
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src="https://material-ui.com/static/images/image-list/burgers.jpg"
              alt=""
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src="https://material-ui.com/static/images/image-list/camera.jpg"
              alt=""
            />
          </ImageListItem>
        </ImageList>
        <Typography variant="h6" fontWeight={100} mt={2}>
          Suggestions
        </Typography>
        {friendSuggestionsData?.friendSuggestions && friendSuggestionsData.friendSuggestions.map((user) =>(
          <List key={user.id} sx={{ width: '100%', maxWidth:380, bgcolor: 'background.paper', padding: 0, margin: 0 }}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={`${api}${user.profilePicture}`} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Button onClick={() => navigate(`/${user.username}`)}  >
                    {`${user.firstName} ${user.lastName}`}
                  </Button>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="caption"
                      color="text.primary"
                    >
                      {user.username}
                    </Typography>
                  </React.Fragment>
                }
              />
                  <Box sx={{ alignSelf: 'center',width:10 }}>
                    <FollowButton user={user} />
                  </Box>
            </ListItem>
          </List>
        ))}
      </Box>
    </Box>
  )
}

export default Rightbar