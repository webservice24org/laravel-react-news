import React, { useState, useEffect } from 'react';
import axios from '/axiosConfig'; // Adjust the import path as needed
import { toast } from 'react-toastify';

const HeaderInfo = () => {
  const [headerInfo, setHeaderInfo] = useState({
    id: null,
    header_logo: '',
    fave_icon: '',
    video_btn_text: 'Video', // Default value
    video_link: '',
  });

  const [previewHeaderLogo, setPreviewHeaderLogo] = useState(null);
  const [previewFaveIcon, setPreviewFaveIcon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeaderInfo = async () => {
      try {
        const response = await axios.get('/api/header-data'); // Adjust the API endpoint as needed
        const headerData = response.data[0]; // Extract the first item from the array
        setHeaderInfo(headerData);
  
        if (headerData.header_logo) {
          setPreviewHeaderLogo(`${axios.defaults.baseURL}storage/logo/${headerData.header_logo}`);
        }
        if (headerData.fave_icon) {
          setPreviewFaveIcon(`${axios.defaults.baseURL}storage/logo/${headerData.fave_icon}`);
        }
  
        setLoading(false);
      } catch (err) {
        setError('Error fetching header info');
        setLoading(false);
      }
    };
  
    fetchHeaderInfo();
  }, []);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHeaderInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;

    if (file) {
      if (name === 'header_logo') {
        setPreviewHeaderLogo(URL.createObjectURL(file));
      } else if (name === 'fave_icon') {
        setPreviewFaveIcon(URL.createObjectURL(file));
      }

      setHeaderInfo((prevData) => ({
        ...prevData,
        [name]: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('video_btn_text', headerInfo.video_btn_text);
    formData.append('video_link', headerInfo.video_link);

    if (headerInfo.header_logo) {
      formData.append('header_logo', headerInfo.header_logo);
    }
    if (headerInfo.fave_icon) {
      formData.append('fave_icon', headerInfo.fave_icon);
    }

    try {
      const response = await axios.post(`/api/header-data-update/${headerInfo.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Header information updated successfully!');
    } catch (error) {
      toast.error('Error updating header info', error.response ? error.response.data : error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="card mt-2">
      <div className="card-header">
<h2>Updated Header Information</h2>
      </div>
      <div className="card-body">
      <div className="header-info-form">
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label className='form-label'>Header Logo:</label>
          <input
            type="file"
            name="header_logo"
            className="form-control"
            onChange={handleFileChange}
          />
          {previewHeaderLogo && (
            <img src={previewHeaderLogo} alt="Header Logo Preview" style={{ width: '200px', height: 'auto', marginTop: '10px' }} />
          )}
        </div>

        <div className='form-group mt-2'>
          <label className='form-label'>Fave Icon:</label>
          <input
            type="file"
            name="fave_icon"
            className="form-control"
            onChange={handleFileChange}
          />
          {previewFaveIcon && (
            <img src={previewFaveIcon} alt="Fave Icon Preview" style={{ width: '50px', height: 'auto', marginTop: '10px' }} />
          )}
        </div>

        <div className='form-group mt-2'>
          <label className='form-label'>Video Button Text:</label>
          <input
            type="text"
            name="video_btn_text"
            className='form-control'
            value={headerInfo.video_btn_text || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className='form-group mt-2'>
          <label className='form-label'>Video Link:</label>
          <input
            type="text"
            name="video_link"
            className='form-control'
            value={headerInfo.video_link || ''}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className='btn btn-primary mt-2'>Update Header Info</button>
      </form>
    </div>
      </div>
    </div>
  );
};

export default HeaderInfo;
