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
  // const [url2, setUrl2] = useState('');
  const [loader, setLoader] = useState(false);
  const [blogcontent, setBlogContent] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [hideEditButton, setHideEditButton] = useState(true);

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
    console.log('hey bemail', email);
    try {
      const { data } = await axios.post(
        'http://localhost:5000/article',
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
      console.log(data.data.urls);
      console.log('openAI data is', data);
      // const answer = data.data.completion.choices[0].message.content;
      // const blogDetails = data.data.scrapCompletion.choices[0].message.content;
      // const finalBlog = data.data.finalContent.choices[0].message.content;
      const blogData = data.data.blogData.finalContent;
      // console.log('blog', finalBlog);
      // const mixedData = finalBlog;
      console.log('my data is', blogData);
      // console.log('my mixed data is', mixedData);
      // console.log('my blogdeetails data is', blogDetails);
      let htmlData = '';
      blogData.split('\n').forEach((line) => {
        htmlData += `<p>${line}</p>`;
      });

      setSummary(htmlData);
      setLoader(false);
      console.log('so content title is ', context);
      // const UrlId = data.data.completion.id;
      // console.log('response Url is ', UrlId);
      setUrl(url);
      setUrl1(url1);
      // setUrl2(url2);

      // const responseData = answer;
      // console.log(responseData);

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
    // setHideEditButton(!editing);
    // setEditing(true);
    // setBlogContent('');
    // setSummary('')
    // setEditedContent('');
  };

  const handleEditClick = () => {
    setEditing(true);
    setEditedContent(summary);
    setHideEditButton(false);
  };

  const handleSaveClick = () => {
    setEditing(false);
    setSummary(editedContent);
    setBlogContent(editedContent);
    setHideEditButton(true);
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
      <Popup show={showPopup} handleClose={handleClosePopup} blogcontent={blogcontent}>
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

              <button onClick={handleSaveClick} type="button">
                Save
              </button>
            </div>
          ) : (
            <div>
              <div dangerouslySetInnerHTML={{ __html: summary }} />
            </div>
          )}
        </div>
        {hideEditButton && (
          <button onClick={handleEditClick} type="button">
            Edit
          </button>
        )}
      </Popup>
    </div>
  );
}

export default Articles;
