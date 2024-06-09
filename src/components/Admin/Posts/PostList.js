import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { Typography } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserList } from '../../../Slice/adminSlice'
import { useDispatch } from 'react-redux'
import { grey } from '@mui/material/colors'
import UsersActions from '../Users/UsersActions'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Delete } from '@mui/icons-material'
import { format } from 'date-fns'
import { toast } from 'react-toastify'

const api = process.env.REACT_APP_MEDIA_API;

const ALLPOST_QUERY = gql`
        query GetAllPost {
            allposts{
            id
            user{
                username
            }
            description
            postedAt
            privacySettings
            dateOfMemory
            image
            }
        }
`
 
const DELETE_POST = gql`
  mutation DeletePost($id:ID!){
    deletePost(id:$id){
      success
    }
  }
`

function PostList() {
    // const users = useSelector(state=> state.admin.userList)
    // const dispatch = useDispatch()

    const [pageSize, setPageSize] = useState(5);
    const [rowId, setRowId] = useState(null);
    const [deleteRowId, setDeleteRowId] = useState(null);

    const {loading,error,data, refetch} = useQuery(ALLPOST_QUERY)
    const posts = data?.allposts || [];

    const [deletePostMutation, { loading: deleteLoading, error: deleteError, data: deleteData }] = useMutation(DELETE_POST);

    const handleDeleteConfirm = async () => {
        try{
            const response = await deletePostMutation({
              variables: {
                id:deleteRowId
              }
            })
            if (response.data.deletePost.success) {
      
              toast.success("Post deleted successfully");
              setDeleteRowId(null);
              refetch()
            } else {
              toast.error("Failed to delete post",{ toastId: 'errorMessage' });
            }
          }catch(error){
            toast.error(error.message || "An error occurred while deleting the post.",{ toastId: 'errorMessage' });
          }

        
      };
    
      const handleDeleteCancel = () => {
        setDeleteRowId(null);
      };
    
      const handleDelete = (id) => {
        setDeleteRowId(id);
      };

    const columns = useMemo(
        () => [
          { field: 'id', headerName: 'Id', width: 50 },
          {
            field: 'image',
            headerName: 'Image',
            width: 100,
            renderCell: (params) => <Avatar src= {`${api}${params.row.image}`}/>,
            sortable: false,
            filterable: false,
          },
          { field: 'user', headerName: 'Username', width: 200, valueGetter: (params) => params.row.user.username, },
          { field: 'postedAt', headerName: 'Posted At', width: 200,
          valueGetter: (params) => {
            const date = new Date(params.row.postedAt);
            return format(date, "dd-MM-yyyy, hh:mm a");
          }    
        },
          { field: 'description', headerName: 'Description', width: 300 },
          {
            field: 'privacySettings',
            headerName: 'Privacy Settings',
            width: 100,
            type: 'boolean',
          },
          {
            field: 'dateOfMemory',
            headerName: 'Date of Memory',
            width: 100,
            // type: 'singleSelect',
            // valueOptions: ['active', 'suspended', 'deleted'],
            // editable: true,
            
          },
          {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => (
              <Delete
                onClick={() => handleDelete(params.row.id)} 
              />
            ),
          },
        ],
        [rowId]
      );

    return (
    <Box 
    sx={{
        height: 500,
        width: '100%',
      }}
    >
        <Typography
                variant="h3"
                component="h3"
                sx={{ textAlign: 'center', mt: 3, mb: 3 }}
        >
            Manage Posts
        </Typography>
        <DataGrid
            columns={columns}
            rows={posts}
            getRowId={row=>row.id}
            pageSizeOptions={[5, 10, 25]}          
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            getRowSpacing={(params) => ({
                top: params.isFirstVisible ? 0 : 5,
                bottom: params.isLastVisible ? 0 : 5,
              })}
              sx={{
                [`& .${gridClasses.row}`]: {
                  bgcolor:grey[200],
                },
            }}  
            onCellEditStart={(params) => setRowId(params.id)}
        />

        <Dialog open={Boolean(deleteRowId)} onClose={handleDeleteCancel}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
            Are you sure you want to delete this Post?
            </DialogContent>
            <DialogActions>
            <Button onClick={handleDeleteConfirm} color="error">
                Delete
            </Button>
            <Button onClick={handleDeleteCancel} color="primary" autoFocus>
                Cancel
            </Button>
            </DialogActions>
        </Dialog>

    </Box>
  )
}

export default PostList