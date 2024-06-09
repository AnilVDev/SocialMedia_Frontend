import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Drawer from '@mui/joy/Drawer';
import DialogTitle from '@mui/joy/DialogTitle';
import ModalClose from '@mui/joy/ModalClose';
import React,{ useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { NOTIFICATIONS } from '../../Graphql/GraphqlQuery';
import Spinner from '../Spinner';
import { ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { Avatar, List, ListItem } from '@mui/joy';
import { useNavigate } from 'react-router';
import { Link, useLocation } from 'react-router-dom';
import { UPDATE_NOTIFICATIONS } from '../../Graphql/GraphqlMutation';
import { useDispatch, useSelector } from 'react-redux';
import { clearNotifications } from '../../Slice/messageNotificationSlice';


const api = process.env.REACT_APP_MEDIA_API;

export default function Notification({ open, setOpen }) {
//   const [open, setOpen] = useState(true);
  const { userInfo } = useSelector(state => state.auth)
  const {loading, error, data:notificationsData, refetch:notificationsRefetch} = useQuery(NOTIFICATIONS)
  const [updateNotification ,{data}] = useMutation(UPDATE_NOTIFICATIONS)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() =>{
    notificationsRefetch()
  })
  const handleClose = (e) => {
    e.preventDefault()
    setOpen(false);
    updateNotification()
    notificationsRefetch()
    dispatch(clearNotifications())
    if (window.location.pathname === '/') {
        navigate('/');
      } else {
        navigate(-1);
      }

  };



  if (loading) return <Spinner/> ;

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer open={open} onClose={handleClose}  > 
        <ModalClose />
          <DialogTitle>Notifications</DialogTitle>
        <Box sx={{ width: 380, padding: 2, overflowY: 'auto'  }}>
          <List>
            {notificationsData && notificationsData.notifications && notificationsData.notifications.length > 0 ? (
              notificationsData.notifications.map(notification => (
                <ListItem key={notification.id} button>
                    {notification.likeOrCommentUser ? (
                        <Link to={`/${notification.likeOrCommentUser.username}`}>
                        <Avatar  src={`${api}${notification.likeOrCommentUser.profilePicture}`} />
                        </Link>
                    ) : null}
                  <ListItemText
                    primary={
                            <>
                            <Typography sx={{
                                fontSize:'13px', 
                                fontFamily:'cursive',                    
                                }}>
                            {notification.message}
                            </Typography>
                        </>
                        }
                    
                    secondary={
                      <>
                        <Typography component="span" variant="body2" sx={{fontSize:'10px', fontStyle:'italic'}}>
                           {new Date(notification.createdAt).toLocaleString()}
                           {!notification.isSeen && (
                                <Typography
                                component="span"
                                variant="body2"
                                sx={{ fontWeight: 'bold',fontSize:'13px', color: 'blue', marginLeft: '15px' }}
                                >
                                new
                                </Typography>
                            )}
                        </Typography>
                      </>
                    }
                  />
                    {notification.post && (
                        <img src={`${api}${notification.post.image}`} alt="" style={{ width: 50, height: 50 }} onClick={(e) => navigate(`/${userInfo?.username}/post/${notification.post.id}`)}/>
                    )}
                </ListItem>
              ))
            ) : (
              <Typography>No notifications available</Typography>
            )}
          </List>
        </Box>

      </Drawer>
    </Box>
  );
} 