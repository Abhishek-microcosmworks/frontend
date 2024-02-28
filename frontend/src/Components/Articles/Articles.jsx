import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { v4 as uuidv4, v4 } from 'uuid';
import spinner from '../../assets/images/loader.gif';
import Popup from '../Popup/Popup';
import plusIcon from '../../assets/images/plus.png';
import minusIcon from '../../assets/images/minus.png';
import './Articles.css';

function Articles() {
  const [context, setContext] = useState('');
  const [summary, setSummary] = useState('');
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [url, setUrl] = useState('');
  const [urlInputs, setUrlInputs] = useState(['']); // State to manage multiple URL inputs
  const [loader, setLoader] = useState(false);
  const [blogcontent, setBlogContent] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [hideEditButton, setHideEditButton] = useState(true);
  const [blogObject, setBlogObject] = useState({});
  const [buttonClicked, setButtonClicked] = useState(false);
  const [numInputs, setNumInputs] = useState(1);

  const serverUrl = 'https://mediaconnects.live/api';

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
    const userToken = localStorage.getItem('token');
    const requestId = uuidv4();

    try {
      const { data } = await axios.post(
        `${serverUrl}/article`,
        {
          requestId,
          urls: urlInputs,
          context,
          blogcontent,
          email,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: userToken,
          },
        },
      );
      setBlogObject(data.data);
      const blogData = data.data.finalContent;
      let htmlData = '';
      blogData.split('\n').forEach((line) => {
        htmlData += `<p>${line}</p>`;
      });

      setSummary(htmlData);
      setLoader(false);
      setUrl(url);
      setBlogContent(htmlData);
      setShowPopup(true);
      setUrlInputs(['']);
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
    const userToken = localStorage.getItem('token');
    try {
      setEditing(false);
      setSummary(editedContent);

      setBlogContent(editedContent);
      setHideEditButton(true);
      const res = await axios.post(
        `${serverUrl}/blog/edit/blog`,
        {
          context,
          id: blogObject._id,
          blogContent: editedContent,
          email: blogObject.email,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: userToken,
          },
        },
      );

      setBlogObject(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddUrlInput = () => {
    if (numInputs < 3) {
      setUrlInputs([...urlInputs, '']);
      setNumInputs(numInputs + 1);
    }
  };

  const handleRemoveUrlInput = () => {
    if (numInputs > 1) {
      setUrlInputs(urlInputs.slice(0, urlInputs.length - 1)); // Remove the last two inputs
      setNumInputs(numInputs - 1); // Update the count accordingly
    }
  };

  const handleUrlInputChange = (index, value) => {
    const updatedInputs = [...urlInputs];
    updatedInputs[index] = value;

    setUrlInputs(updatedInputs);
  };

  // const handleRemoveUrlInput = (index) => {
  //   const updatedInputs = [...urlInputs];
  //   updatedInputs.splice(index, 1);
  //   setUrlInputs(updatedInputs);
  //   setNumInputs(numInputs - 1);
  // };

  const calculateMarginTop = () => {
    if (urlInputs.length === 2) {
      return '80px';
    }
    if (urlInputs.length === 3) {
      return '150px';
    }
    return '30px';
  };

  const handleRegenerateBlog = async () => {
    try {
      const email = localStorage.getItem('email');
      const userToken = localStorage.getItem('token');
      const requestId = uuidv4();
      setLoader(true);
      const { data } = await axios.post(
        `${serverUrl}/article`,
        {
          requestId,
          urls: urlInputs,
          context,
          blogcontent,
          email,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: userToken,
          },
        },
      );
      setBlogObject(data.data);
      const blogData = data.data.finalContent;
      let htmlData = '';
      blogData.split('\n').forEach((line) => {
        htmlData += `<p>${line}</p>`;
      });
      setSummary(htmlData);
      setLoader(false);
      setUrl(url);
      setBlogContent(htmlData);
      setLoader(false);
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };

  return (
    <div className="blog_container">
      <div className="heading_text">Craft Your Blog: Building from References</div>
      <div className="title_label">
        <span className="refernce_url_txt">Blog Title</span>
        <input
          disabled={loader}
          className="input_label_context"
          type="search context"
          placeholder="Enter Blog Title"
          id="context-title"
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
      </div>
      <div className="url_label">
        <span className="refernce_url_txt">Reference URLs</span>
        <div className="input-container">
          <div className="add-input-btn-container">
            <button type="button" onClick={handleAddUrlInput} disabled={numInputs >= 3 || loader}>
              <img src={plusIcon} alt="plusIcon" />
            </button>
            <button type="button" onClick={handleRemoveUrlInput} disabled={numInputs <= 1 || loader}>
              <img src={minusIcon} alt="minusIcon" />
            </button>
          </div>
          <div className="all-inputs">
            {urlInputs.map((urlInput, index) => (
              <input
                key={v4()}
                disabled={loader}
                className="input_label_url"
                placeholder={`Reference URL ${index + 1}`}
                type="text"
                value={urlInput}
                onChange={(e) => handleUrlInputChange(index, e.target.value)}
              />

            ))}
          </div>
        </div>
      </div>
      {/* <div id="textareaBox" rows="2" cols="50" /> */}
      <div className="btn_blog" style={{ marginTop: calculateMarginTop() }}>
        <button
          onClick={handleSubmit}
          style={{ backgroundColor: !context || !urlInputs.every(Boolean) ? '#66b2b2' : '#008080' }}
          className="btn_blog_generator"
          type="submit"
          disabled={!context || !urlInputs.every(Boolean) || loader}
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
        handleRegenerateBlog={handleRegenerateBlog}
        loader={loader}
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
