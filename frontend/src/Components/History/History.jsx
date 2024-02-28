import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { CKEditor } from '@ckeditor/ckeditor5-react';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import './History.css';

function History() {
  const userToken = localStorage.getItem('token');
  const [historyDetails, setHistoryDetails] = useState([]);
  const [historyObject, setHistoryObject] = useState({});
  const [editedHistory, setEditedHistory] = useState('');
  const [editItemId, setEditItemId] = useState(null);
  // const [contextValue, setContextValue] = useState('');
  const serverUrl = 'https://mediaconnects.live/api';

  const handleGetHistory = async () => {
    const email = localStorage.getItem('email');
    const name = localStorage.getItem('name');
    try {
      const res = await axios.post(
        `${serverUrl}/history`,
        {
          email,
          name,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: userToken,
          },
        },
      );
      setHistoryDetails(res.data.data);
    } catch (error) {
      console.error('Error showing history:', error);
    }
  };
  useEffect(() => {
    handleGetHistory();
  }, []);

  const handleEditClick = (detail) => {
    // setEdit(true);
    setEditedHistory(detail.finalContent);
    setEditItemId(detail._id);
    setHistoryObject(detail);
  };
  const handleDeleteClick = async (detail) => {
    try {
      await axios.post(
        `${serverUrl}/blog/delete`,
        {
          id: detail._id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: userToken,
          },
        },
      );
      setHistoryDetails(historyDetails.filter((item) => item._id !== detail._id));
      console.log('blog deleted');
    } catch (error) {
      console.error('Error in deleting history:', error);
    }
  };
  const handleSaveClick = async () => {
    setEditItemId(null);

    // Remove <p> tags from the beginning and end of the edited content
    const strippedContent = editedHistory.replace(/^<p>|<\/p>$/g, '');

    const res = await axios.post(
      `${serverUrl}/blog/edit/blog`,
      {
        context: historyObject.title,
        id: historyObject._id,
        blogContent: strippedContent,
        email: historyObject.email,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: userToken,
        },
      },
    );
    setHistoryObject(res.data.data);
    // console.log(res.data.data.data.finalContent);
    // let htmlData = '';
    // res.data.data.data.finalContent.split('\n').forEach((line) => {
    //   htmlData += `<p>${line}</p>`;
    // });
    // setEditedHistory(htmlData);
    const updatedDetails = historyDetails.map((detail) => {
      if (detail._id === historyObject._id) {
        return { ...detail, finalContent: editedHistory };
      }
      return detail;
    });
    setHistoryDetails(updatedDetails);
  };

  return (
    <div className="history-container">
      {historyDetails.length === 0 ? (
        <div className="no-blogs-message">
          <p>No blogs to show.</p>
          <a href="/" className="articles-link">Craft a blog</a>
        </div>
      ) : (
        historyDetails.map((detail) => (
          <div key={detail._id} className="history-item">
            <div className="getHistory">
              {editItemId === detail._id ? (
                <div className="history-editor">
                  <div
                    id="textarea"
                    className="input-textarea"
                    style={{
                      overflowY: 'scroll',
                      overflowX: 'hidden',
                      backgroundColor: 'white',
                      borderRadius: '7px',
                      border: 'none',
                      outline: 'none',
                      fontFamily: 'Noto Sans',
                      resize: 'none',
                      fontSize: '16px',
                      fontWeight: '457',
                      color: '#000000',
                      boxShadow: '4px 4px 8px black',
                    }}
                  >
                    <CKEditor
                      editor={ClassicEditor}
                      data={editedHistory}
                      config={{
                        autoParagraph: false, // Disable auto-wrapping with <p> tags
                      }}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setEditedHistory(data);
                      }}
                    />
                    <div className="saveHistory-btn">
                      <button onClick={handleSaveClick} type="button">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  id="textarea"
                  className="input-textarea"
                  style={{
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    backgroundColor: 'white',
                    borderRadius: '7px',
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'Noto Sans',
                    resize: 'none',
                    fontSize: '16px',
                    fontWeight: '457',
                    color: '#000000',
                    boxShadow: '4px 4px 8px black',
                  }}
                >
                  <h3 style={{ textAlign: 'center', fontSize: '24px' }}>{detail.title}</h3>
                  <p style={{ padding: '2%' }}>{detail.finalContent.replace(/^<p>|<\/p>$/g, '')}</p>
                  <div className="historyEdit-btn">
                    <button onClick={() => handleEditClick(detail)} type="button">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteClick(detail)} type="button">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default History;
