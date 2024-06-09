import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Button, Grid, Typography } from '@material-ui/core';
import { useMutation, useQuery } from '@apollo/client';
import { BLOCKED_USER_LIST } from '../../Graphql/GraphqlQuery';
import { UNBLOCK_USER_MUTATION } from '../../Graphql/GraphqlMutation';

const api = process.env.REACT_APP_MEDIA_API;


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      padding: theme.spacing(2),
      overflowY: 'auto', 
      height: '100vh'
    },
    avatar: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    userContainer: {
      display: 'flex',
      alignItems: 'flex-start', 
      justifyContent: 'space-between',
      marginBottom: theme.spacing(2),
    },
    userDetails: {
      marginLeft: theme.spacing(3),
      flexGrow: 1,
      
    },
    title: {
      marginBottom: theme.spacing(2),
    },
  }));
  
  function BlockedUserList() {
    const classes = useStyles();
    const { data: blockedUserListData, loading, refetch: blockedUserListRefetch } = useQuery(BLOCKED_USER_LIST);
    const [unblockUser,{loading:unblockUserLoading,}] = useMutation(UNBLOCK_USER_MUTATION)
  
    useEffect(() => {
      blockedUserListRefetch();
    }, []);

    const handleSubmit = async (userId) => {
        try {
          await unblockUser({ variables: { blockedBy: userId } });
          blockedUserListRefetch();
        } catch (error) {
          console.error("Error unblocking user:", error);
        }
      };
  
    return (
      <div className={classes.root}>
        <Typography variant="h6" className={classes.title}>Blocked Users</Typography>
        {blockedUserListData?.blockedUsers.length > 0 ? (
          blockedUserListData?.blockedUsers.map((user) => (
            <Grid key={user.id} className={classes.userContainer}>
              <Grid item>
                <Avatar alt={`${user.firstName} ${user.lastName}`} src={`${api}${user.profilePicture}`} className={classes.avatar} />
              </Grid>
              <Grid item className={classes.userDetails}>
                <Typography variant="body1">{`${user.firstName} ${user.lastName}`}</Typography>
                <Typography variant="body2" color="textSecondary">{`@${user.username}`}</Typography>
              </Grid>
              <Grid item style={{ marginLeft:'10px'}} >
                <Button variant="outlined" color="secondary" onClick={() => handleSubmit(user.id)}>Unblock</Button>
              </Grid>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">No users blocked.</Typography>
        )}
      </div>
    );
  }
  
  export default BlockedUserList;