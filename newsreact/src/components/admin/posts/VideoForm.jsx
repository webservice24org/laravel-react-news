import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '/axiosConfig'; 
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

function VideoForm() {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [isTop, setIsTop] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [existingThumbnail, setExistingThumbnail] = useState('');

  const navigate = useNavigate();
  const { id } = useParams(); 
  useEffect(() => {
    if (id) {
      const fetchVideo = async () => {
        try {
          const response = await axios.get(`/api/video-news/${id}`);
          const video = response.data;
          setVideoTitle(video.video_title);
          setVideoLink(video.video_link);
          setIsTop(video.isTop);
          setExistingThumbnail(video.video_thumbnail);
          setEditMode(true);
        } catch (err) {
          toast.error('Error fetching video details.');
        }
      };

      fetchVideo();
    }
  }, [id]);

  const handleFileChange = (e) => {
    setVideoThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('video_title', videoTitle);
    formData.append('video_link', videoLink);
    formData.append('isTop', isTop ? 1 : 0); 

    if (videoThumbnail) {
      formData.append('video_thumbnail', videoThumbnail);
    }

    try {
      let response;
      if (editMode) {
        response = await axios.post(`/api/video-news/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await axios.post('/api/video-news', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
      toast.success(response.data.message);
      navigate('/admin/video-news');
    } catch (err) {
      if (err.response && err.response.status === 422) {
        toast.error('Validation failed: ' + JSON.stringify(err.response.data.errors));
      } else {
        toast.error('An error occurred: ' + err.message);
      }
    }
  };

  return (
    <div className="card mt-3">
      <div className="card-header">
        <h3 className='float-start'>{editMode ? 'Edit Video' : 'Add New Video'}</h3>
        <Button className='float-end' onClick={() => navigate('/admin/video-news')}>
            Video List
        </Button>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input 
              type="text" 
              className="form-control" 
              value={videoTitle} 
              onChange={(e) => setVideoTitle(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Video Link</label>
            <input 
              type="text" 
              className="form-control" 
              value={videoLink} 
              onChange={(e) => setVideoLink(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Thumbnail</label>
            <input 
              type="file" 
              className="form-control" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            {existingThumbnail && (
              <img
                src={`${axios.defaults.baseURL}storage/video/${existingThumbnail}`}
                alt="Thumbnail Preview"
                style={{ width: '100px', height: 'auto', marginTop: '10px' }}
              />
            )}
          </div>
          <div className="mb-3">
            
            <input 
              type="checkbox" 
              className="form-check-input" 
              checked={isTop} 
              onChange={(e) => setIsTop(e.target.checked)} 
            />
            <label className="form-check-labe ms-1">Is Top</label>
          </div>
          <button type="submit" className="btn btn-primary">
            {editMode ? 'Update Video' : 'Add Video'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VideoForm;
