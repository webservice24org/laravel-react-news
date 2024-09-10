import React, { useState, useEffect } from 'react';
import axiosInstance from '/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Accordion, Badge, Dropdown } from 'react-bootstrap';
import axios from '/axiosConfig';
import { toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';

function PostForm() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [postData, setPostData] = useState({
    post_upper_title: null,
    post_title: '',
    post_sub_title: null,
    post_details: '',
    post_slug: '',
    seo_title: '',
    seo_descp: '',
    reporter_name: '',
    division_id: null, 
    district_id: null,
    category_id: '', 
    post_thumbnail: '',
    thumbnail_caption: '',
    thumbnail_alt: '',
    news_source: '',
    user_id: null, 
    videoLink: '',
    isLead: false,
    sub_category_ids: [],
    tags: [] 
});



  
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [accordionKey, setAccordionKey] = useState("0");
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [newTag, setNewTag] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState([]);


  useEffect(() => {
    fetchDivisions();
    fetchCategories();
    fetchUsers();

    if (postId) {
      fetchPost(postId);
    }
  }, [postId]);

  useEffect(() => {
    if (postData.division_id) {
      fetchDistricts(postData.division_id);
    }
  }, [postData.division_id]);

  useEffect(() => {
    if (postData.category_id) {
      fetchSubCategories(postData.category_id);
    }
  }, [postData.category_id]);

  const fetchDivisions = async () => {
    try {
      const response = await axios.get('/api/divisions');
      setDivisions(response.data.data || response.data);
    } catch (error) {
      toast.error('Failed to fetch divisions.');
    }
  };

  const fetchDistricts = async (divisionId) => {
    try {
      const response = await axios.get(`/api/districts?division_id=${divisionId}`);
      setDistricts(response.data.data || response.data);
    } catch (error) {
      toast.error('Failed to fetch districts.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data.data || response.data);
    } catch (error) {
      toast.error('Failed to fetch categories.');
    }
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await axios.get(`/api/sub-categories?category_id=${categoryId}`);
      setSubCategories(response.data.data || response.data);
    } catch (error) {
      toast.error('Failed to fetch sub-categories.');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/auth/index');
      setUsers(response.data.data || response.data);
    } catch (error) {
      toast.error('Failed to fetch users.');
    }
  };

  const fetchPost = async (id) => {
    try {
      const response = await axios.get(`/api/posts/${id}`);
      const data = response.data.data || response.data;
  
      setPostData({
        ...data,
        seo_title: data.seo?.seo_title || '',
        seo_descp: data.seo?.seo_descp || '',
        category_id: data.category?.id || '',
        sub_category_ids: data.subcategories?.map(sub => sub.id) || []
      });
    } catch (error) {
      toast.error('Failed to fetch post data.');
    }
  };

  const fetchTagSuggestions = async (query) => {
    try {
      const response = await axios.get(`/api/tags?search=${query}`);
      setTagSuggestions(response.data.data || response.data);
    } catch (error) {
      toast.error('Failed to fetch tag suggestions.');
    }
  };
  

  const handleInputChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleMultiSelectChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setPostData({ ...postData, sub_category_ids: selectedValues }); 
  };
  
  const handleEditorChange = (content) => {
    setPostData({ ...postData, post_details: content });
  };

  const handleTagsChange = async (e) => {
    setNewTag(e.target.value);
    await fetchTagSuggestions(e.target.value);
  };

  const handleAddTag = async (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault(); 
      const trimmedTag = newTag.trim();
      if (trimmedTag && !postData.tags.some(tag => tag.tag_name === trimmedTag)) {
        const existingTag = tagSuggestions.find(tag => tag.tag_name === trimmedTag);
        if (existingTag) {
          setPostData(prevData => ({
            ...prevData,
            tags: [...prevData.tags, existingTag]
          }));
        } else {
          try {
            const response = await axios.post('/api/tags', { tag_name: trimmedTag });
            const newTag = response.data.data;
            setPostData(prevData => ({
              ...prevData,
              tags: [...prevData.tags, newTag]
            }));
            setTagSuggestions(prevSuggestions => [...prevSuggestions, newTag]);
          } catch (error) {
            console.error('Failed to create new tag:', error);
            toast.error('Failed to create new tag.');
          }
        }
        setNewTag('');
        setTagSuggestions([]);
      }
    }
  };
  

  const handleSelectTag = (tag) => {
    if (!postData.tags.some(t => t.tag_name === tag.tag_name)) {
      setPostData(prevData => ({
        ...prevData,
        tags: [...prevData.tags, tag]
      }));
      setNewTag('');
      setTagSuggestions([]);
    }
  };
  

  const handleRemoveTag = (tagId) => {
    setPostData(prevData => ({
      ...prevData,
      tags: prevData.tags.filter(tag => tag.id !== tagId)
    }));
  };
  
  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);

      setPostData((prevState) => ({
        ...prevState,
        post_thumbnail: file,
      }));
    }
  };
  

  const handleSavePost = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    postData.tags.forEach(tag => formData.append('tags[]', tag.tag_name));
  
    Object.keys(postData).forEach(key => {
        if (Array.isArray(postData[key])) {
            postData[key].forEach(item => formData.append(`${key}[]`, item));
        } else if (postData[key] !== undefined && postData[key] !== null) {
            formData.append(key, postData[key]);
        } else {
            formData.append(key, ''); 
        }
    });

    formData.append('old_post_thumbnail', postData.post_thumbnail || '');

    try {
        const requestMethod = postId ? axios.post : axios.post;
        const url = postId ? `/api/update/${postId}` : '/api/posts';
      
        await requestMethod(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
      
        toast.success(`Post ${postId ? 'updated' : 'created'} successfully.`);
        navigate('/admin/posts');
    } catch (error) {
        console.error('Error saving post:', error.response?.data || error.message);
        toast.error('Failed to save post.');
    }
};

  return (
    <div className='mt-3'>
      <div className='card mb-2'>
        <div className='card-header'>
          <h2 className='float-start'>{postId ? 'Edit Post' : 'Add Post'}</h2>
          <Button className='float-end' onClick={() => navigate('/admin/posts')}>
            Post List
        </Button>
        </div>
      </div>

      <Form onSubmit={handleSavePost}>
        <input type="hidden" name="id" value={postId} />
        <div className='row'>
          <div className='col-md-9 col-sm-12'>
            <div className='card shadow bg-white rounded'>
              <div className='card-body'>
                <Form.Group className='mb-3'>
                  <Form.Label>Post Upper Title <small className='text-danger'>(optional)</small></Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter post upper title'
                    name='post_upper_title'
                    value={postData.post_upper_title}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Post Title <small className='text-danger'>*</small></Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter post title'
                    name='post_title'
                    value={postData.post_title}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Post Sub Title <small className='text-danger'>(optional)</small></Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter post sub title'
                    name='post_sub_title'
                    value={postData.post_sub_title}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Post Details <small className='text-danger'>*</small></Form.Label>
                  <Editor
                    apiKey='r24p9oqicwy6ccj2ntw3q6u2jal1ex8hzk0fpu8qj7ys77ob'
                    value={postData.post_details}
                    init={{
                      height: 400,
                      menubar: true,
                      plugins: [
                        'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                        'searchreplace wordcount visualblocks visualchars code fullscreen',
                        'insertdatetime media nonbreaking save table contextmenu directionality',
                        'emoticons template paste textcolor colorpicker textpattern imagetools'
                      ],
                      toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | forecolor backcolor emoticons | print preview media | code fullscreen',
                      a11y_advanced_options: true,
                      image_title: true,
                      automatic_uploads: true,
                      file_picker_types: 'file image media',
                      image_uploadtab: true,
                      image_advtab: true,
                      image_caption: true,
                      images_upload_credentials: true,
                      file_picker_callback: function (cb, value, meta) {
                        var input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/*');

                        input.onchange = function () {
                          var file = this.files[0];

                          var reader = new FileReader();
                          reader.onload = function () {
                            var id = 'blobid' + (new Date()).getTime();
                            var blobCache = tinymce.activeEditor.editorUpload.blobCache;
                            var base64 = reader.result.split(',')[1];
                            var blobInfo = blobCache.create(id, file, base64);
                            blobCache.add(blobInfo);

                            cb(blobInfo.blobUri(), { title: file.name });
                          };
                          reader.readAsDataURL(file);
                        };

                        input.click();
                      },
                      content_css: '//www.tiny.cloud/css/codepen.min.css'
                    }}
                    onEditorChange={handleEditorChange}
                  />
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Post Slug <small className='text-danger'>(optional)</small></Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter post slug'
                    name='post_slug'
                    value={postData.post_slug}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Accordion defaultActiveKey="0" activeKey={accordionKey} onSelect={(key) => setAccordionKey(key)}>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>SEO Information <small className='text-danger ps-1'>(optional)</small></Accordion.Header>
                    <Accordion.Body>
                      <Form.Group className='mb-3'>
                        <Form.Label>SEO Title</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Enter SEO title'
                          name='seo_title'
                          value={postData.seo_title}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group className='mb-3'>
                        <Form.Label>SEO Description</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={3}
                          placeholder='Enter SEO description'
                          name='seo_descp'
                          value={postData.seo_descp}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
                
                <Form.Group className='mb-3'>
                  <Form.Label>Tags <small className='text-danger'>(optional)</small></Form.Label>
                  <div className='d-flex'>
                    <Form.Control
                      type='text'
                      value={newTag}
                      onChange={handleTagsChange}
                      onKeyDown={handleAddTag}
                      placeholder='Add a tag and press Enter'
                    />
                    <Button
                      variant='outline-primary'
                      onClick={handleAddTag}
                      className='ms-2'
                    >
                      Add
                    </Button>
                  </div>
                  <div className='mt-2'>
                    {tagSuggestions.length > 0 && (
                      <div className='border border-light rounded p-2 bg-light'>
                        <ul className='tag-list'>
                          {tagSuggestions.map((tag) => (
                            <li key={tag.id}>
                              <Button
                                variant='link'
                                onClick={() => handleSelectTag(tag)}
                              >
                                {tag.tag_name}
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className='mt-2'>
                    {postData.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        pill
                        bg='secondary'
                        className='me-2'
                        onClick={() => handleRemoveTag(tag.id)}
                      >
                        {tag.tag_name} <span className='text-white'>×</span>
                      </Badge>
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className='mb-3'>
                <Form.Label>Video Link <small className='text-danger'>(optional)</small></Form.Label>
                <Form.Control
                  type='url'
                  placeholder='Enter video link'
                  name='videoLink'
                  value={postData.videoLink}
                  onChange={handleInputChange}
                />
              </Form.Group>

              </div>
            </div>
          </div>
          <div className='col-md-3 col-sm-12'>
            <div className='card shadow bg-white rounded'>
              <div className='card-body'>
              <Form.Group className='mb-3'>
              <Form.Check 
                  type='checkbox' 
                  label='Is Lead Article'
                  name='isLead'
                  checked={postData.isLead}
                  onChange={(e) => setPostData({ ...postData, isLead: e.target.checked })}
              />
              </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Reporter Name <small className='text-danger'>(optional)</small></Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter reporter name'
                    name='reporter_name'
                    value={postData.reporter_name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Division <small className='text-danger'>(optional)</small></Form.Label>
                  <Form.Control
                    as='select'
                    name='division_id'
                    value={postData.division_id}
                    onChange={handleInputChange}
                  >
                    <option value=''>Select Division</option>
                    {divisions.map((division) => (
                      <option key={division.id} value={division.id}>
                        {division.division_name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>District <small className='text-danger'>(optional)</small></Form.Label>
                  <Form.Control
                    as='select'
                    name='district_id'
                    value={postData.district_id}
                    onChange={handleInputChange}
                  >
                    <option value=''>Select District</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.district_name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className='mb-3'>
                <Form.Label>Category <small className='text-danger'>*</small></Form.Label>
                <Form.Control
                  as='select'
                  name='category_id'
                  value={postData.category_id}
                  onChange={handleInputChange}
                >
                  <option value=''>Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label>Sub Categories <small className='text-danger'>*</small></Form.Label>
                <Form.Control
                  as="select"
                  multiple
                  name="sub_category_ids"
                  value={postData.sub_category_ids}
                  onChange={handleMultiSelectChange}
                >
                  {subCategories.map(subCategory => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.sub_category_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label>Post Thumbnail <small className='text-danger'>*</small></Form.Label>
                <Form.Control
                  type='file'
                  accept='image/*'
                  name='post_thumbnail'
                  onChange={handleThumbnailChange}
                />

                <div>
                  {postData.post_thumbnail && !thumbnailPreview && (
                    <img
                      src={`${axiosInstance.defaults.baseURL}storage/post/${postData.post_thumbnail}`}
                      alt='Thumbnail'
                      className='img-thumbnail mt-2'
                    />
                  )}
                  
                  {thumbnailPreview && (
                    <img
                      src={thumbnailPreview}
                      alt='Thumbnail preview'
                      className='img-thumbnail mt-2'
                    />
                  )}
                </div>
                <Form.Control
                  type='hidden'
                  name='old_post_thumbnail'
                  value={postData.post_thumbnail || ''}
                />
              </Form.Group>
              <Form.Group className='mb-3'>
                  <Form.Label>Thumbnail Caption <small className='text-danger'>(optional)</small></Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter thumbnail caption'
                    name='thumbnail_caption'
                    value={postData.thumbnail_caption}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Thumbnail Alt <small className='text-danger'>(optional)</small></Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter thumbnail alt'
                    name='thumbnail_alt'
                    value={postData.thumbnail_alt}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>News Source <small className='text-danger'>(optional)</small></Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter news source'
                    name='news_source'
                    value={postData.news_source}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>User <small className='text-danger'>(optional)</small></Form.Label>
                  <Form.Control
                    as='select'
                    name='user_id'
                    value={postData.user_id}
                    onChange={handleInputChange}
                  >
                    <option value=''>Select User</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Button variant='primary' type='submit'>
                  Save Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default PostForm;
