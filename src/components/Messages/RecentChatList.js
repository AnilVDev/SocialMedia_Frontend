import React from 'react';
import { GET_RECENT_CHATS } from '../../Graphql/GraphqlQuery';
import { useQuery } from '@apollo/client';

const RecentChatList = () => {
  const { loading, error, data: recentChatData, refetch: recentChatRefetch } = useQuery(GET_RECENT_CHATS);

  const chats = [
    {
      id: 1,
      avatar: 'https://example.com/avatar1.jpg',
      username: 'User1',
      lastMessage: 'Hey there!',
    },
    {
      id: 2,
      avatar: 'https://example.com/avatar2.jpg',
      username: 'User2',
      lastMessage: 'What are you up to?',
    },
    {
      id: 3,
      avatar: 'https://example.com/avatar3.jpg',
      username: 'User3',
      lastMessage: 'How was your day?',
    },
  ];

  return (
    <div className="recent-chat-list" style={{ height: '100%', width: '300px', backgroundColor: '#f0f0f0', padding: '0px' }}>
      {recentChatData.map(chat => (
        <div key={chat.id} className="chat-item" style={{ marginBottom: '20px' }}>
          <img src={chat.avatar} alt="User Avatar" className="avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
          <div className="chat-details">
            <h3 style={{ margin: '0', fontSize: '16px' }}>{chat.username}</h3>
            <p style={{ margin: '0', fontSize: '14px' }}>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentChatList;
