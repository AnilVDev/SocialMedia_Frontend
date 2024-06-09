import { gql } from "@apollo/client";


  export const ADD_FOLLOWER_MUTATION = gql`
    mutation AddFollower($id: ID!) {
        addFollower(id: $id) {
        success
        message
        }
    }
  `

  export const UNFOLLOW_MUTATION = gql`
    mutation RemoveFollower($id: ID!) {
      removeFollower(id: $id) {
      success
      message
      }
  }
  `

  export const SEARCH_USERS_MUTATION = gql`
  mutation SearchUsers($search: String!) {
    searchUsers(search: $search) {
      matchingUsers {
        id
        username
        firstName
        lastName
        profilePicture
      }
    }
  }
`;

export const CREATE_POST_MUTATION = gql`
mutation CreatePost($description: String, $image: String!, $privacySettings: Boolean, $dateOfMemory: Date) {
  createPost( description: $description, image: $image, privacySettings: $privacySettings, dateOfMemory: $dateOfMemory) {
    success
  }
}
`;

export const DELETE_POST = gql`
  mutation DeletePost($id:ID!){
    deletePost(id:$id){
      success
    }
  }
`
export const UPDATE_POST = gql`
  mutation UpdatePost($id:ID,$description:String,$privacySettings: Boolean, $dateOfMemory: Date){
    updatePost(id:$id,description:$description,privacySettings: $privacySettings, dateOfMemory: $dateOfMemory){
      success
    }
  }
  `

  export const LIKE_POST = gql`
    mutation UpdateLikePost($postId:ID!){
      likePost(postId:$postId) {
        success
        liked
      }
    }
  `
  export const CREATE_COMMENT = gql`
    mutation CreateComment($post_id:ID!, $comment:String){
      addComment(postId:$post_id, comment:$comment){
        success
      }
    }
  `

  
export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile(
    $firstName: String
    $lastName: String
    $bio: String
    $gender: String
    $mobile: String
    $profilePicture: String
    $deleteProfilePicture: Boolean
  ) {
    updateUserProfile(
      firstName: $firstName
      lastName: $lastName
      bio: $bio
      gender: $gender
      mobile: $mobile
      profilePicture: $profilePicture
      deleteProfilePicture: $deleteProfilePicture
    ) {
      user {
        id
        firstName
        lastName
        bio
        gender
        mobile
        profilePicture
      }
    }
  }
`;

export const UPDATE_MESSAGE_SEEN = gql`
  mutation UpdateMessageSeen($username:String!){
    messageSeen(username:$username){
      success
    }
  }
`

export const UPDATE_NOTIFICATIONS = gql`
  mutation UpadateNotifications{
    notificationIsSeen{
      success
    }
  }
`
export const CHANGE_PASSWORD_MUTATION = gql`
mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
  changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
    success
    message
  }
}
`;

export const BLOCK_USER_MUTATION = gql`
  mutation BlockUser($blockedBy: ID!) {
      blockUser(blockedBy: $blockedBy) {
        blockedUser {
          id
        }
      }
    }
`;

export const UNBLOCK_USER_MUTATION = gql`
  mutation UnblockUser($blockedBy: ID!) {
    unblockUser(blockedBy: $blockedBy) {
      success
    }
  }
`

export const CREATE_USER_RELATION = gql`
mutation createUserRelation($toUserId: ID!,$relationshipType:String!){
  createRelationship(toUserId:$toUserId,relationshipType:$relationshipType){
    success
    errorMessage
  }
}
`

export const DELETE_RELATION_MUTATION = gql`
  mutation deleteRelation($toUserId: ID!){
      deleteRelationship(toUserId:$toUserId){
        success
      }
  }
`