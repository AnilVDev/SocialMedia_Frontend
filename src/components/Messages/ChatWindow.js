import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import WebSocketService from '../../Slice/websocketService';
import { Box, Divider, IconButton, styled, useTheme } from '@mui/material';
import NavbarWithRecentChat from './NavbarWithRecentChat';
import { GET_PERSONAL_CHAT, GET_RECENT_CHATS, GET_USER_BY_USERNAME } from '../../Graphql/GraphqlQuery'
import { useMutation, useQuery } from '@apollo/client';
import { Textarea } from '@mui/joy';
import { useNavigate, useParams } from 'react-router';
import { Close } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_MESSAGE_SEEN } from '../../Graphql/GraphqlMutation';
import { clearMessageCount, setMessageSent } from '../../Slice/messageNotificationSlice';

const api = process.env.REACT_APP_MEDIA_API;

const ContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh', // Set height to fill the viewport height
}));

const ChatDrawerContent = styled(Box)(({ theme }) => ({
  overflowY: 'auto', // Add vertical scroll if content exceeds height
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
  
}));

const ChatWindow = () => {
  const messageListRef = useRef(null);
  const { username } = useParams();
  const { user, userInfo } = useSelector((state) => state.auth)
  const { userOnline } = useSelector(state => state.onlineStatus)

  const [messages, setMessages] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [ws, setWs] = useState(null);

  const access_token =user?.access
  const sender = userInfo?.username

  const {  data: recentChatData, refetch: recentChatRefetch } = useQuery(GET_RECENT_CHATS);
  const { loading, error, data:personalChatData,refetch:personalChatRefetch } = useQuery(GET_PERSONAL_CHAT, {
    variables: { username },
  });
  const {data:userData, refetch:userDataRefetch} = useQuery(GET_USER_BY_USERNAME, {
    variables: { username}
  })

  const [ messageSeenMutation, {data:messageSeenData} ] = useMutation(UPDATE_MESSAGE_SEEN)

  useEffect(()=>{
    const response=messageSeenMutation({variables:{username}})
    console.log("response--",response)
    recentChatRefetch()
  },[])

  useEffect(() => {

    const ws = new WebSocket(`ws://localhost:8000/ws/${username}/?token=${access_token}`);
    setWs(ws);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setReceivedMessages((prevMessages) => [...prevMessages, message]);
      personalChatRefetch({ username });
      userDataRefetch()
      dispatch(setMessageSent())
      dispatch(clearMessageCount());
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [username]); 

  // Function to send a message via WebSocket
  const sendMessage = (message, username, receiver) => {
    if (message.trim() !== "") {
      if (ws && ws.readyState === WebSocket.OPEN) {
        const payload = {
          message: message,
          username: username,
          receiver: receiver 
        };
        ws.send(JSON.stringify(payload));
        setMessages("")
        dispatch(setMessageSent())
        console.log("refetch in chatwindow")
      }
  }
  };
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [personalChatData]);

  let messageList = [];
  if (personalChatData && personalChatData.personalChat) {
    messageList = personalChatData.personalChat.map((message, index) => {
      const messageData = JSON.parse(message);
      const timestamp = new Date(messageData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return (
        <ListItem key={index}>
        <ListItemText
            primary={(
              <React.Fragment>
                <span style={{ 
                  padding: '6px',
                  borderRadius:'5px', 
                  backgroundColor: 'ButtonShadow', 
                  // color: 'white',
                  fontSize:'15px'
                }}>
                  {messageData.message}
                </span>
              </React.Fragment>
            )}
          secondary={(
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                sx={{ display: 'inline-block',fontSize:'11px', fontStyle:'italic' }}
              >
                {timestamp}
              </Typography>
            </React.Fragment>
          )}
          sx={{ textAlign: messageData.sender === username ? 'left' : 'right' }}
        />
      </ListItem>
      );
    });
  }

  // Placeholder for online status logic (replace with API call or data retrieval)
  const searchedUsername = userData?.searchedUser.user.username;
  const isOnline = userOnline[searchedUsername] || false;

  return (
<>
<ContentContainer>
    <NavbarWithRecentChat />

<div 
  style={{ 
    position: 'fixed', 
    left: '350px', 
    width: 'calc(100vw - 350px)',
    height: 'calc(100vh - 100px)',
    padding:'10px', 
    margin:'30px 50px 20px 20px',
    backgroundColor:'white',
    borderColor:'black',
    borderRadius:'5px'

    }}>

  <ChatDrawerContent>

    <Grid container direction="column" spacing={2}
      sx={{p:2 }}
    >
      <Grid container alignItems="center">
        <Grid item>
        <Avatar alt="" src={`${api}${userData?.searchedUser.user.profilePicture}`} 
            sx={{ width:40,height:40}}
            onClick = {() => navigate(`/${userData?.searchedUser.user.username}`)}
          />              
        </Grid>
        <Grid item xs>
          <Typography variant="h6">{userData?.searchedUser.user.firstName} {userData?.searchedUser.user.lastName}</Typography>
          <Typography variant="caption">{isOnline ? 'Online' : 'Offline'}</Typography>
        </Grid>
        <Grid item>
          <IconButton onClick={e => {navigate('/chats')}}>
            <Close />
          </IconButton>
        </Grid>
      </Grid>
      <Divider/>
      <Grid item xs={12} sx={{ flex: 1 }}>
        <List ref={messageListRef} sx={{ maxHeight: 500, overflowY: 'auto' }}>{messageList}</List>
      </Grid>
      <Grid item sx={{ position: 'fixed', bottom: 10, left: 350, width: 'calc(75vw - 350px)', p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={8} sm={8}>
            <Textarea
              value={messages}
              multiline
              minRows={1}
              label="Type..."
              placeholder="Enter a message"
              onChange={(e) => setMessages(e.target.value)}
              sx={{ width:600, left:300}}
            />
          </Grid> 
          <Grid item xs={4} sm={4}>
            <Button variant="contained" color="primary" onClick={() => sendMessage(messages,sender,username)}
              sx={{ left: '350px'}}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Grid>  
    </Grid>

  </ChatDrawerContent>
</div>

    </ContentContainer>
    </>    
  );
};

export default ChatWindow;
