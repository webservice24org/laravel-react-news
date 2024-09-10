import React, { useState, useEffect, useRef } from 'react';
import { Button, Table } from 'react-bootstrap';
import axios from '/axiosConfig'; 
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import $ from 'jquery'; 
import 'datatables.net-bs5'; 
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css'; 

function VideoNews() {
  const [videoNews, setVideoNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchVideoNews();
  }, []);

  useEffect(() => {
    if (videoNews.length > 0) {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().clear().destroy();
      }
      $(tableRef.current).DataTable({
        data: videoNews.map((video, index) => [
          video.id,
          video.video_title,
          `<img 
            src="${axios.defaults.baseURL}storage/video/${video.video_thumbnail}" 
            alt="Video Thumbnail" 
            style="width: 100px; height: auto;" 
            onerror="this.src='${axios.defaults.baseURL}storage/video/default-thumbnail.jpg';" 
          />`,
          `<a href="${video.video_link}" target="_blank" rel="noopener noreferrer">Watch Video</a>`,
          video.isTop ? 'Yes' : 'No',
          video.id 
        ]),
        columns: [
          { title: "ID" },
          { title: "Title" },
          { title: "Thumbnail" },
          { title: "Video Link" },
          { title: "Is Top" },
          {
            title: "Actions",
            orderable: false,
            render: function (data, type, row) {
              return `
                <button class="btn btn-primary me-1 edit-btn" data-id="${row[5]}">Edit</button>
                <button class="btn btn-danger delete-btn" data-id="${row[5]}">Delete</button>
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
  }, [videoNews]);

  const fetchVideoNews = () => {
    axios.get('/api/video-news')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setVideoNews(response.data);
        } else {
          console.error('Unexpected response structure');
        }
        setLoading(false);
      })
      .catch(() => {
        console.error('Error fetching video news');
        setLoading(false);
      });
  };

  const handleEdit = (id) => {
    navigate(`/admin/video-news/edit/${id}`);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action will delete the video permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/video-news/${id}`)
          .then(() => {
            Swal.fire(
              'Deleted!',
              'The video has been deleted.',
              'success'
            );
            fetchVideoNews(); 
          })
          .catch(() => {
            Swal.fire(
              'Error!',
              'There was an issue deleting the video.',
              'error'
            );
          });
      }
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="card mt-3">
      <div className="card-header">
      <Button className='float-end' onClick={() => navigate('/admin/video-news/create')}>
        Add New Video
      </Button>
      </div>
      <div className="card-body">
      <div className='mt-3'>
      
      <Table
        striped
        bordered
        hover
        responsive
        ref={tableRef}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Thumbnail</th>
            <th>Video Link</th>
            <th>Is Top</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* DataTables will populate the table body */}
        </tbody>
      </Table>
    </div>
      </div>
    </div>
    
  );
}

export default VideoNews;
