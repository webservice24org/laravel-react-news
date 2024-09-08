import React, { useState, useEffect } from 'react';
import axios from "/axiosConfig"; 
import axiosInstance from '/axiosConfig';
import { toast } from 'react-toastify';

const FooterInfo = () => {
  const [footerInfo, setFooterInfo] = useState({
    id: null, 
    footer_logo: '',
    footer_info: '',
    address_one: '',
    address_two: '',
    phone: '',
    mobile: '',
    chairman_name: '',
    chairman_designation: '',
    md_name: '',
    md_designation: '',
  });

  const [previewLogo, setPreviewLogo] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFooterInfo = async () => {
      try {
        const response = await axios.get('/api/footer-infos'); 
        const footerData = response.data[0]; 
        setFooterInfo(footerData);
        if (footerData.footer_logo) {
          setPreviewLogo(`${axiosInstance.defaults.baseURL}storage/logo/${footerData.footer_logo}`); 
        }
        setLoading(false);
      } catch (err) {
        setError('Error fetching footer info');
        setLoading(false);
      }
    };

    fetchFooterInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFooterInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewLogo(URL.createObjectURL(file)); 
      setFooterInfo((prevData) => ({
        ...prevData,
        footer_logo: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('footer_info', footerInfo.footer_info);
    formData.append('address_one', footerInfo.address_one);
    formData.append('address_two', footerInfo.address_two);
    formData.append('phone', footerInfo.phone);
    formData.append('mobile', footerInfo.mobile);
    formData.append('chairman_name', footerInfo.chairman_name);
    formData.append('chairman_designation', footerInfo.chairman_designation);
    formData.append('md_name', footerInfo.md_name);
    formData.append('md_designation', footerInfo.md_designation);

    if (footerInfo.footer_logo) {
        formData.append('footer_logo', footerInfo.footer_logo);
    }

    try {
        const response = await axios.post(`/api/footer-infos-update/${footerInfo.id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        toast.success('Data updated successfully!');
    } catch (error) {
        toast.error('Error updating footer info', error.response ? error.response.data : error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="card mt-2">
      <div className="card-header">
      <h2 className='text-center fw-bold'>Update Footer Information</h2>
      </div>
      <div className="card-body">
      <div className="footer-info-form">
      <input type="hidden" name="id" value={footerInfo.id} />
      
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label className='form-label'>Footer Logo:</label>
          <input
            type="file"
            name="footer_logo"
            className="form-control"
            onChange={handleFileChange} 
          />
          <input type="hidden" name="old_footer_logo" value={footerInfo.footer_logo} />
        </div>

        <div className='form-group mt-2'>
          {previewLogo && (
            <img src={previewLogo} alt="Logo Preview" style={{ width: '200px', height: 'auto' }} />
          )}
        </div>

        <div className='form-group mt-2'>
          <label className='form-label'>Footer Info:</label>
          <textarea
            name="footer_info"
            className='form-control'
            value={footerInfo.footer_info || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className='form-group mt-2'>
          <label className='form-label'>Address One:</label>
          <input
            type="text"
            name="address_one"
            className='form-control'
            value={footerInfo.address_one || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className='form-group mt-2'>
          <label className='form-label'>Address Two:</label>
          <input
            type="text"
            name="address_two"
            className='form-control'
            value={footerInfo.address_two || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className="row mt-2">
            <div className="col-md-6">
                <div className='form-group'>
                    <label className='form-label'>Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        className='form-control'
                        value={footerInfo.phone || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div className="col-md-6">
                <div className='form-group'>
                <label className='form-label'>Mobile:</label>
                <input
                    type="text"
                    name="mobile"
                    className='form-control'
                    value={footerInfo.mobile || ''}
                    onChange={handleInputChange}
                />
                </div>
            </div>
        </div>

        <div className="row mt-2">
            <div className="col-md-6">
                <div className='form-group'>
                    <label className='form-label'>Chairman Name:</label>
                    <input
                        type="text"
                        name="chairman_name"
                        className='form-control'
                        value={footerInfo.chairman_name || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div className="col-md-6">
                <div className='form-group'>
                    <label className='form-label'>Chairman Designation:</label>
                    <input
                        type="text"
                        name="chairman_designation"
                        className='form-control'
                        value={footerInfo.chairman_designation || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
        </div>
        
        <div className="row mt-2">
            <div className="col-md-6">
                <div className='form-group'>
                    <label className='form-label'>MD Name:</label>
                    <input
                        type="text"
                        name="md_name"
                        className='form-control'
                        value={footerInfo.md_name || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div className="col-md-6">
                <div className='form-group'>
                    <label className='form-label'>MD Designation:</label>
                    <input
                        type="text"
                        name="md_designation"
                        className='form-control'
                        value={footerInfo.md_designation || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
        </div>

        <button type="submit" className='btn btn-primary mt-2'>Update Footer Info</button>
      </form>
    </div>
      </div>
    </div>
  );
};

export default FooterInfo;
