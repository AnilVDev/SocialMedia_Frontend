import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import Home from '../pages/Home/Home'
import Profile from '../pages/Profile/Profile'
import Dashboard from '../pages/Admin/Dashboard'
import NotFoundPage from '../pages/PageNotFound'
import ProfileSettings from '../pages/Profile/ProfileSettings'
import CreatePostMutation from '../pages/Post/createPostMutation'
import SearchPage from '../pages/Search/SearchPage'
import FriendProfilePage from '../pages/FreindProfilePage/FriendProfilePage'
import Following from '../components/Friends/Following'
import Followers from '../components/Friends/Followers'
import MessagePage from '../pages/Messages/MessagePage'
import ChatWindow from '../components/Messages/ChatWindow'
import FriendFollowers from '../components/Friends/FriendFollowers'
import FriendFollowing from '../components/Friends/FriendFollowing'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserStatus } from '../Slice/onlineStatusSlice'
import { addNotification, updateNewPost, updateUserMessageNotify } from '../Slice/messageNotificationSlice'
import Notification from '../components/Notification/Notification'
import IndividualPostDialog from '../components/Post/IndividualPostDialog'
import ChangePasswordPage from '../pages/Profile/ChangePasswordPage'
import BlockedUsersPage from '../pages/Settings/BlockedUsersPage'
import FamilyTreePage from '../pages/FamilyTree/FamilyTreePage'
import { getUserInfo } from '../Slice/authSlice'
import useAxios from '../Slice/useAxios'

export default function MainRouter() {

  const { user,userInfo } = useSelector((state) => state.auth)
  const access_token =user?.access
  const loggedin_user =userInfo?.username
  const [ws, setWs] = useState(null);
  const [notify, setNotify] = useState(null);
  const dispatch = useDispatch()
  const axiosInstance = useAxios(access_token);

   const connectWebSocket = () =>{
    if (user && access_token && loggedin_user){
      const ws  = new WebSocket(`ws://localhost:8000/ws/online/?token=${access_token}`)
      setWs(ws)

      ws.onopen = () => {
        console.log('CONNECTED TO ONLINE CONSUMER');
        console.log("user :",loggedin_user)
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            'username':loggedin_user,
            'type':'open'
        }))
      }
      };
  
      window.addEventListener("beforeunload", function(e){
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            'username': loggedin_user,
            'type':'offline'
          }));
        }
    })

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if(message.username != loggedin_user ){
          const { username, online_status } = message;

          dispatch(updateUserStatus({ userId: username, status: online_status }));         
        }
      };
  
      ws.onclose = () => {
        console.log('DISCONNECTED FROM ONLINE CONSUMER');
        setTimeout(connectWebSocket, 5000);
      };
  
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        ws.close()
      };
    }

  }


  const connectNotifyWebSocket = () =>{
     if (user && access_token && loggedin_user){
      const notify_message  = new WebSocket(`ws://localhost:8000/ws/notify/?token=${access_token}`)
      setNotify(notify_message)

      notify_message.onopen = () => {
        console.log('CONNECTED TO NOTIFICATION');
      };
  
    notify_message.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("notify--:",message)
        if (message.count !== undefined) {
          dispatch(updateUserMessageNotify({ count: message.count }));
        } 
        if (message.notifications !== undefined) {
          message.notifications.forEach(notification => {
              dispatch(addNotification({ notification }));
          });
        }
        if(message.newPostCreated != undefined){
          dispatch(updateNewPost())
        }
      };
  
      notify_message.onclose = () => {
        console.log('DISCONNECTED FROM NOTIFICATION');
        setTimeout(connectNotifyWebSocket, 5000);
      };
  
      notify_message.onerror = (error) => {
        console.error('WebSocket error:', error);
        notify_message.close();
      };
    }
  }

  useEffect(() => {
    if(user && access_token && loggedin_user){
    connectWebSocket();
    connectNotifyWebSocket();
    dispatch(getUserInfo(axiosInstance));
    }
    return () => {
      if (ws) {
        ws.send(JSON.stringify({
          'username': loggedin_user,
          'type': 'offline'
        }));
        ws.close();
      }
      if (notify) {
        notify.close();
      }
    };
  }, [user, loggedin_user, access_token, dispatch]);


  return (
    <>
        <Routes>
            <Route path='/' element={ <Home />} />
            <Route path='/profile' element= { <Profile />} />
            <Route path='/profile/account-settings' element= { <ProfileSettings />} />
            <Route path= "/dashboard" element={ <Dashboard /> } />
            <Route path='/create-post' element ={ <CreatePostMutation/> } />
            <Route path='/search' element= { <SearchPage /> } />
            <Route path='/:username' element={<FriendProfilePage />} />
            <Route path= '/:username/post/:postId' element={<IndividualPostDialog />} />
            <Route path='/:username/followers' element={<FriendFollowers />} />
            <Route path='/:username/following' element={<FriendFollowing />} />
            <Route path= '/following' element= { <Following />} />
            <Route path= '/followers' element= { <Followers />} />
            <Route path= '/chats' element= { <MessagePage />} />
            <Route path= '/chats/:username' element= { <ChatWindow />} />
            <Route path= '/notifications' element= { <Notification />} />
            <Route path='/family-tree' element= { <FamilyTreePage />} />
            <Route path= '/settings/change-password' element= {<ChangePasswordPage />} />
            <Route path= '/settings/blocked-users' element = { <BlockedUsersPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>  
    </>
  )
}
