import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { CKEditor } from '@ckeditor/ckeditor5-react';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import spinner from '../../assets/images/loader.gif';

import './Articles.css';

import Popup from '../Popup/Popup';

function Articles() {
  const [context, setContext] = useState('');
  const [summary, setSummary] = useState('');
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [url, setUrl] = useState('');
  const [url1, setUrl1] = useState('');
  const [loader, setLoader] = useState(false);
  const [blogcontent, setBlogContent] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [hideEditButton, setHideEditButton] = useState(true);
  const [blogObject, setBlogObject] = useState({});
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    if (!showPopup) {
      setEditing(false);
      setEditedContent('');
    }
  }, [showPopup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    const email = localStorage.getItem('email');
    try {
      const { data } = await axios.post(
        'http://3.233.72.68/:5000/article',
        {
          urls: [url, url1],
          context,
          blogcontent,
          email,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('openAI data is', data);
      setBlogObject(data.data);
      const blogData = data.data.blogData.finalContent;
      console.log('my data is', blogData);
      let htmlData = '';
      blogData.split('\n').forEach((line) => {
        htmlData += `<p>${line}</p>`;
      });

      setSummary(htmlData);
      setLoader(false);
      console.log('so content title is ', context);
      setUrl(url);
      setUrl1(url1);
      setBlogContent(htmlData);
      setShowPopup(true);
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };
  const handleClosePopup = () => {
    setShowPopup(false);
    setContext('');
    setUrl('');
    setEditing(false);
    setButtonClicked(false);
  };

  const handleSaveClick = async () => {
    setEditing(false);
    setSummary(editedContent);
    setBlogContent(editedContent);
    setHideEditButton(true);
    console.log(blogObject.blogData._id);
    const res = await axios.post('http://3.233.72.68/:5000/blog/edit/blog', {
      context,
      id: blogObject.blogData._id,
      blogContent: editedContent,
      email: blogObject.blogData.email,
    });
    console.log(res);
    setBlogObject(res.data);
  };

  return (
    <div className="blog_container">
      <div className="heading">Generate blog based on your context</div>
      <div className="title_label">
        <input
          className="input_label_context"
          type="search context"
          placeholder="Enter Blog Title"
          id="context-title"
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
      </div>
      <div className="url_label">
        <input
          className="input_label_url"
          placeholder="Reference URL"
          type="text"
          id="reference"
          name="reference"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <div id="textareaBox" rows="2" cols="50" />
      {/* {textareas.map((textarea, index) => (
        <div key={index}>{textarea}</div>
      ))} */}
      {/* {editing ? (
        <button onClick={handleSaveClick} type="button">
          Save
        </button>
      ) : (
        <button onClick={handleEditClick} type="button">
          Edit
        </button>
      )} */}
      <div className="btn_blog">
        <button
          onClick={handleSubmit}
          className="btn_blog_generator"
          // style={{ height: '30px', width: '40%', marginTop: '15px' }}
          type="submit"
        >
          {loader ? (
            <img src={spinner} alt="spinner" width="20px" height="20px" />
          ) : (
            'Generate Blog'
          )}
        </button>
      </div>
      <Popup
        show={showPopup}
        handleClose={handleClosePopup}
        blogcontent={blogcontent}
        setHideEditButton={setHideEditButton}
        hideEditButton={hideEditButton}
        editing={editing}
        setEditing={setEditing}
        setEditedContent={setEditedContent}
        summary={summary}
        setButtonClicked={setButtonClicked}
        buttonClicked={buttonClicked}
      >
        <h2>Blog Generated Successfully!</h2>
        <div className="editor">
          {editing ? (
            <div>
              <CKEditor
                editor={ClassicEditor}
                data={editedContent}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setEditedContent(data);
                }}
              />

              <div className="save-btn">
                <button onClick={handleSaveClick} type="button">
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div dangerouslySetInnerHTML={{ __html: summary }} />
            </div>
          )}
        </div>
      </Popup>
    </div>
  );
}

export default Articles;