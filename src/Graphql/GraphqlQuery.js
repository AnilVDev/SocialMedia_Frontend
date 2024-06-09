import { gql } from 'graphql-tag';




export const IS_FOLLOWING_QUERY = gql`
  query IsFollowing($followingId: ID!) {
    isFollowing(followingId: $followingId)
  }
`;

export const FOLLOWING = gql`
  query Following_Users{
    following{
      id
      firstName
      lastName
      username
      profilePicture
    }
  }
`


export const FOLLOWERS = gql`
  query Followed_Users{
    followers {
      id
      firstName
      lastName
      username
      profilePicture
    }
  }
`

export const FRIEND_FOLLOWING = gql`
  query Following_Users($Id: ID!){
    friendFollowing(id:$Id){
      id
      firstName
      lastName
      username
      profilePicture
    }
  }
`


export const FRIEND_FOLLOWERS = gql`
  query Followed_Users($Id: ID!){
    friendFollowers(id:$Id){
      id
      firstName
      lastName
      username
      profilePicture
    }
  }
`

export const GET_USER_BY_USERNAME = gql`
  query GetUserByUsername($username: String!) {
    searchedUser(username: $username){
    user{
      id
      username
      firstName
      lastName
      profilePicture
    }
      posts {
        id
        description
        dateOfMemory
        image
        postedAt
      }
    }
  }
`;

export const POST_QUERY = gql`
  query GetPosts {
    posts {
      id
      description
      dateOfMemory
      image
      postedAt
    }
  }
`;

export const IS_LIKED_QUERY = gql`
  query GetPostIsLiked($postId:ID!){
    isLiked(postId:$postId)
  }
`
export const TOTAL_LIKES_QUERY = gql`
  query GetPostTotalLikes($postId:ID!){
    totalLikesForPost(postId:$postId)
  }
`

export const ALL_COMMENTS = gql`
  query AllCommentsPost($postId:ID!){
    allComments(postId:$postId){
      user {
        username
        profilePicture
      }
      content
      createdAt     
    }
  }
`

export const NEWSFEED_POSTS_QUERY = gql`
  query NewsFeedsPosts{
    newsfeedPosts {
      id
      user {
        id
        username
        profilePicture
        firstName
        lastName
      }
      description
      postedAt
      privacySettings
      dateOfMemory
      image
    }
  }
`;


export const GET_RECENT_CHATS = gql`
query GetRecentChats($searchQuery: String) {
  recentChats(searchQuery: $searchQuery){
    threadName
    id
    message
    isSeen
    threadName
		receiver{
      id
      username
      firstName
      lastName
      profilePicture
    }
    sender{
      id
      username
      firstName
      lastName
      profilePicture
    }
  }
}
`;

export const GET_PERSONAL_CHAT = gql`
  query GetPersonalChat($username: String!) {
    personalChat(username: $username)
  }
`;

export const FRIEND_SUGGESTIONS = gql`
  query GetFriendSuggestions{
    friendSuggestions{
      id
      username
      firstName
      lastName
      profilePicture      
    }
  }
`

export const NOTIFICATIONS = gql`
 query GetNotifications{
  notifications {
    id
    user {
      id
      username
    }
    likeOrCommentUser {
      id
      username
      profilePicture
    }
    message
    post {
      id
      image
    }
    createdAt
    isSeen
  }
 }
`

export const BLOCKED_USER_LIST = gql`
 query GetBlockedUserList{
    blockedUsers{
      id
      username
      profilePicture
      firstName
      lastName
    }
 }
`

export const GET_USER_FAMILY_TREE = gql`
  query GetUserRelations{
    userRelationships{
      relationshipType
      fromUser{
        id
        firstName
        lastName
        username
        profilePicture
      }
      toUser{
        id
        firstName
        lastName
        username
        profilePicture
      }
    }
  }
`