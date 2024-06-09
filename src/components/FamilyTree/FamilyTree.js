// FamilyTree.js
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { TextField, Button, Avatar, MenuItem, Select, FormControl, InputLabel, Box, Typography } from '@mui/material';
import Tree from 'react-d3-tree';
import { GET_USER_FAMILY_TREE } from '../../Graphql/GraphqlQuery';
import { CREATE_USER_RELATION, DELETE_RELATION_MUTATION, SEARCH_USERS_MUTATION } from '../../Graphql/GraphqlMutation';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';


const api = process.env.REACT_APP_MEDIA_API;




function FamilyTree() {
  const { user,userInfo } = useSelector((state) => state.auth)  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [relationType, setRelationType] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate()

  const { data: familyData, refetch: refetchFamilyTree, error } = useQuery(GET_USER_FAMILY_TREE);
  const [addRelation] = useMutation(CREATE_USER_RELATION);
  const [deleteRelation] = useMutation(DELETE_RELATION_MUTATION)
  const [searchUsers] = useMutation(SEARCH_USERS_MUTATION)
console.log("relations:",familyData)

  const handleSearchChange = (e) => {
    e.preventDefault()
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const { data } = await searchUsers({ variables: { search: searchTerm } });
    setSearchResults(data.searchUsers.matchingUsers);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user); 
  };

  const handleAddRelation = async () => {
    if (selectedUser && relationType) {
      try {
        const { data } = await addRelation({
          variables: {
            toUserId: selectedUser.id,
            relationshipType: relationType,
          },
        });
  
        if (data.createRelationship.success) {
          toast.success('Your relation is added.');
        } else {
          toast.error(data.createRelationship.errorMessage);
        }
  
        setSelectedUser(null);
        setRelationType('');
        refetchFamilyTree();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  if (error) {
    if (error.message === "User is not active" || error.message === "Invalid token or user not found") {
      navigate('/login')
    }
    toast.error(error.message,{ toastId: 'errorMessage' });
  }

  // const formatFamilyTreeData = (relationships) => {
  //   const users = {};
  //   relationships.forEach(({ fromUser, toUser, relationshipType }) => {
  //     if (!users[fromUser.id]) {
  //       users[fromUser.id] = { ...fromUser, children: [] };
  //     }
  //     if (!users[toUser.id]) {
  //       users[toUser.id] = { ...toUser, children: [] };
  //     }
  //     if (relationshipType === 'child') {
  //       users[fromUser.id].children.push(users[toUser.id]);
  //     }
  //   });

  //   return Object.values(users).find(user => user.id === user.id); // Adjust to find the root node if needed
  // };


 
  const formatFamilyTreeData = (relationships, userInfo) => {
    const users = {};
    const rootId = userInfo.id; // Root user ID
  
    // Initialize the root user
    users[rootId] = {...userInfo, children: [], level: 1 }; // Level 1: Parents
  
    // Process each relationship
    relationships.forEach(({ fromUser, toUser, relationshipType }) => {
      if (!users[fromUser.id]) {
        users[fromUser.id] = {...fromUser, children: [], level: 2 }; // Level 2: Current User
      }
      if (!users[toUser.id]) {
        users[toUser.id] = {...toUser, children: [], level: 3 }; // Level 3: Children
      }
  
      // Determine the relationship type and update accordingly
      switch (relationshipType) {
        case 'FATHER':
        case 'MOTHER':
          // Parents are direct parents of the root user
          users[rootId].children.push({...users[toUser.id], relationshipType });
          break;
        case 'SON':
        case 'DAUGHTER':
          // Children are direct children of the root user
          users[fromUser.id].children.push({...users[toUser.id], relationshipType });
          // Also add children to the partner's node if exists
          const partner = relationships.find(
            (rel) =>
              rel.fromUser.id === fromUser.id &&
              ['WIFE', 'HUSBAND'].includes(rel.relationshipType)
          );
          if (partner) {
            users[partner.toUser.id].children.push({...users[toUser.id], relationshipType });
          }
          break;
        case 'BROTHER':
        case 'SISTER':
          // Siblings are at the middle level, added as children of the parents
          const parentRel = relationships.find(
            (rel) =>
              rel.toUser.id === fromUser.id &&
              ['FATHER', 'MOTHER'].includes(rel.relationshipType)
          );
          if (parentRel) {
            users[parentRel.fromUser.id].children.push({...users[toUser.id], relationshipType });
          }
          break;
        case 'WIFE':
        case 'HUSBAND':
          // Spouse is at the same level as the current user
          users[fromUser.id].children.push({...users[toUser.id], relationshipType });
          break;
        default:
          break;
      }
    });
  
    // Return the formatted family tree starting from the root user
    return users[rootId];
  }

  // const treeData = familyData ? formatFamilyTreeData(familyData.userRelationships) : null;
  const treeData = familyData ? formatFamilyTreeData(familyData.userRelationships, userInfo) : null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh',width: '800px', marginTop:'30px' }}>
        
<Box sx={{ display: 'flex', flexDirection: 'column', width: '60%', height:'35%', overflow:'auto' }}>
  <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
    <TextField
      label="Search Users"
      variant="outlined"
      fullWidth
      value={searchTerm}
      onChange={handleSearchChange}
    />
    <Button
      type="submit"
      variant="contained"
      sx={{ ml: 2 }}
      onClick={handleSearchSubmit}
    >
      Search
    </Button>
  </Box>
  <Box sx={{ padding: 2 }}>
    {/* Display search results */}
    {searchResults.map((user) => (
  <Box
    key={user.id}
    sx={{
      display: 'flex',
      alignItems: 'center',
      marginBottom: 1,
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '8px',
      backgroundColor: user === selectedUser ? '#e0f7fa' : 'inherit', // Highlight selected user
    }}
  >
    <Avatar src={`${api}${user.profilePicture}`} />
    <Box sx={{ marginLeft: 2 }}>
      {user.firstName} {user.lastName} ({user.username})
    </Box>
    <Button
      variant="contained"
      onClick={() => handleSelectUser(user)}
      sx={{
        width:'100px',
        marginLeft: 'auto',
        backgroundColor: user === selectedUser ? '#4caf50' : '#2196f3', // Change button color if selected
        color: user === selectedUser ? '#ffffff' : '#000000', // Change text color if selected
      }}
    >
      {user === selectedUser ? 'Selected' : 'Select'}
    </Button>
  </Box>
))}
  </Box>
  {selectedUser && (
    <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
      <FormControl fullWidth sx={{ mr: 2 }}>
        <InputLabel>Relation</InputLabel>
        <Select
          value={relationType}
          onChange={(e) => setRelationType(e.target.value)}
        >
          <MenuItem value="parent">Parent</MenuItem>
          <MenuItem value="child">Child</MenuItem>
          <MenuItem value="sibling">Sibling</MenuItem>
          <MenuItem value="partner">Partner</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddRelation}
      >
        Add Relation
      </Button>
    </Box>
  )}
</Box>

<Box sx={{ height: '65%', padding: 2, overflow: 'auto',width:'100%' }}>
        {treeData && (
          <Tree
            data={treeData}
            orientation="vertical"
            translate={{ x: 400, y: 50 }}
            nodeSize={{ x: 250, y: 250 }}
            renderCustomNodeElement={(rd3tProps) => (
              <foreignObject x={-75} y={-75} width={150} height={150}>
                <Box sx={{ border: '1px solid black', borderRadius: '50%', padding: 1, textAlign: 'center' }}>
                  <Avatar src={`${api}${rd3tProps.nodeDatum.profilePicture}`} sx={{ margin: '0 auto' }} />
                  <Typography sx={{fontWeight:'bold'}}>{rd3tProps.nodeDatum.firstName} {rd3tProps.nodeDatum.lastName}</Typography>
                  <Box>@{rd3tProps.nodeDatum.username}</Box>
                    {rd3tProps.nodeDatum.relationshipType && (
                      <Box sx={{ fontSize: '12px', color: 'gray' }}>
                        ({rd3tProps.nodeDatum.relationshipType})
                      </Box>
                    )}
                </Box>
              </foreignObject>
            )}
          />
        )}
      </Box>
    </Box>
  );
}

export default FamilyTree;

