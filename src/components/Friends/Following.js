import * as React from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { FOLLOWING } from '../../Graphql/GraphqlQuery'
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router';


const api = process.env.REACT_APP_MEDIA_API;


export default function Following() {
  const [open, setOpen] = useState(true);
  const {data:followingUsersData,refetch:followingUsersRefetch} = useQuery(FOLLOWING)
  const navigate = useNavigate()  


  return (
    <React.Fragment>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => {
            setOpen(false);
            navigate(-1);
        }}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 500,
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg',
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            Following
          </Typography>
          {/* <Typography id="modal-desc" textColor="text.tertiary">
            Make sure to use <code>aria-labelledby</code> on the modal dialog with an
            optional <code>aria-describedby</code> attribute.
          </Typography> */}
          <List>
            {followingUsersData && followingUsersData.following.map(user => (
              <ListItem key={user.id}>
                <ListItemAvatar>
                  <Avatar
                    alt={user.username} 
                    src={`${api}${user.profilePicture}`}
                    onClick = {() => navigate(`/${user.username}`)}
                    sx={{ cursor: 'pointer' }} 
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography 
                        variant="h6" 
                        component="span" 
                        sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                        onClick = {() => navigate(`/${user.username}`)}
                        
                      >
                      {user.firstName} {user.lastName}
                      </Typography>
                    </React.Fragment>
                  }
                  secondary={user.username}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="remove">
                    {/* Icon for removing user */}
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

        </Sheet>
      </Modal>
    </React.Fragment>
  );
}