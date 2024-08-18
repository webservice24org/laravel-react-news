import React, { useState, useEffect, useRef } from 'react';
import { Button, Table } from 'react-bootstrap';
import axios from '/axiosConfig'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import $ from 'jquery'; 
import 'datatables.net-bs5'; 
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css'; 

function PostList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const tableRef = useRef(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().clear().destroy();
      }
      $(tableRef.current).DataTable({
        data: posts.map((post, index) => [
          index + 1,
          post.post_title,
          post.reporter_name,
          `<img 
            src="${axios.defaults.baseURL}storage/post/${post.post_thumbnail}" 
            alt="Post Thumbnail" 
            style="width: 100px; height: auto;" 
            onerror="this.src='/path/to/default-image.jpg';" 
          />`,
          post.id 
        ]),
        columns: [
          { title: "SL" },
          { title: "Title" },
          { title: "Reporter" },
          { title: "Thumbnail" },
          {
            title: "Actions",
            orderable: false,
            render: function (data, type, row) {
              return `
                <button class="btn btn-primary me-1 edit-btn" data-id="${row[4]}">Edit</button>
                <button class="btn btn-danger delete-btn" data-id="${row[4]}">Delete</button>
              `;
            }
          }
        ],
        responsive: true
      });

      $(tableRef.current).on('click', '.edit-btn', function () {
        const id = $(this).data('id');
        handleEdit(id);
      });

      $(tableRef.current).on('click', '.delete-btn', function () {
        const id = $(this).data('id');
        handleDelete(id);
      });
    }

    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().clear().destroy();
      }
    };
  }, [posts]);

  const fetchPosts = () => {
    axios.get('/api/posts/')
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setPosts(response.data.data);
        } else {
          toast.error('Unexpected response structure');
        }
        setIsLoading(false);
      })
      .catch(() => {
        toast.error('Error fetching posts');
        setIsLoading(false);
      });
  };

  const handleEdit = (id) => {
    navigate(`/admin/posts/edit/${id}`); 
    console.log('Edit post with ID:', id);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/posts/${id}`)
          .then(() => {
            toast.success('Post deleted successfully');
            fetchPosts();
          })
          .catch(() => {
            toast.error('Error deleting post');
          });
      }
    });
  };

  return (
    <div className='mt-3'>
      <Button className='mb-3' onClick={() => navigate('/admin/posts/create')}>
        Add New Post
      </Button>
      <Table striped bordered hover responsive ref={tableRef}>
        <thead>
          <tr>
            <th style={{ width: '5%' }}>SL</th>
            <th style={{ width: '30%' }}>Title</th>
            <th style={{ width: '20%' }}>Reporter</th>
            <th style={{ width: '20%' }}>Thumbnail</th>
            <th style={{ width: '25%' }} className='text-center'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="5" className="text-center">Loading...</td>
            </tr>
          ) : posts.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No posts found.</td>
            </tr>
          ) : null}
        </tbody>
      </Table>
    </div>
  );
}

export default PostList;
