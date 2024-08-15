import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '/axiosConfig';
import axiosInstance from '/axiosConfig';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';


function PostList() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    axios.get('/api/post-list')
      .then((response) => {
        setPosts(response.data.data || response.data);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  };
  

  const handleEditPost = (postId) => {
    navigate(`/admin/posts/edit/${postId}`);
  };
  

  const handleDeletePost = (postId) => {
  
    if (!postId) {
      toast.error('Failed to delete post. Invalid post ID.');
      return;
    }
  
    const url = `/api/posts/${postId}`;
    
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(url);
          toast.success('Post deleted successfully.');
          fetchPosts();
        } catch (error) {
          toast.error('Failed to delete post.');
        }
      }
    });
  };
  
  

  return (
    <div className='mt-3'>
      <Button className='mb-3' onClick={() => navigate('/admin/posts/create')}>
        Add New Post
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th style={{ width: '5%' }}>SL</th>
            <th style={{ width: '30%' }}>Title</th>
            <th style={{ width: '25%' }}>Thumbnail</th>
            <th style={{ width: '20%' }}>Reporter</th>
            <th style={{ width: '20%' }} className='text-center'>Actions</th>
          </tr>
        </thead>
        <tbody>
  {posts.map((post, index) => (
    <tr key={post.id}>
      <td>{index + 1}</td>
      <td>{post.post_title}</td>
      <td>
        <img 
          src={`${axiosInstance.defaults.baseURL}storage/post/${post.post_thumbnail}`} 
          alt="Post Thumbnail" 
          style={{ width: '100px', height: 'auto' }} 
          onError={(e) => { e.target.src = '/path/to/default-image.jpg'; }} 
        />
      </td>
      <td>{post.reporter_name}</td>
      <td className='text-center'>
      <Button className='btn btn-primary me-1' onClick={() => handleEditPost(post.id)}>
            Edit
          </Button>
        <Button className='btn btn-danger' onClick={() => handleDeletePost(post.id)}>Delete</Button>
      </td>
    </tr>
  ))}
</tbody>

      </Table>
    </div>
  );
}

export default PostList;
