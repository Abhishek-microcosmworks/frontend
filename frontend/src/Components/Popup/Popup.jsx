import React, { useState } from 'react';

import axios from 'axios';

import './Popup.css';

import PropTypes from 'prop-types';

import closeIcon from '../../assets/images/icons8-close-60.png';

import spinner from '../../assets/images/loader.gif';

function Popup({
  show,
  children,
  handleClose,
  blogcontent,
  setHideEditButton,
  hideEditButton,
  editing,
  setEditing,
  setEditedContent,
  summary,
  setButtonClicked,
  buttonClicked,
}) {
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [blogContext, setBlogContext] = useState('');
  const [contextGenerating, setContextGenerating] = useState(false);
  const [imagesUrl, setImagesUrl] = useState([]);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [showButtons, setShowButtons] = useState(false);
  const [expandedImage, setExpandedImage] = useState('');
  const showHideClassName = show ? 'popup display-block' : 'popup display-none';

  async function getImages() {
    const res = await axios.post('http://localhost:5000/blog/getImages', {
      email: localStorage.getItem('email'),
    });

    console.log(res.data.images);
    setImagesUrl(res.data.images);
  }

  const handleGenerateContext = async () => {
    try {
      setContextGenerating(true);
      const matches = blogcontent.match(/<p>(.*?)<\/p>/g);
      const cleanedContent = matches ? matches.map((match) => match.replace(/<\/?p>/g, '')).join('') : '';
      const finalCleanedContent = cleanedContent.replace(/"/g, '');
      console.log(finalCleanedContent);
      const response = await axios.post('http://localhost:5000/gen-context', {
        blogContent: `${finalCleanedContent}`,
      });

      console.log(blogContext);
      setBlogContext(response.data.choices[0].message.content);
      setContextGenerating(false);
      setButtonClicked(true);
    } catch (error) {
      console.log(error);
      setContextGenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    try {
      setIsLoading(true);

      if (blogContext !== '') {
        console.log(blogContext);
        const imageResponse = await axios.post('http://localhost:5000/gen-image', {
          prompt: blogContext,
          email: localStorage.getItem('email'),
        });

        console.log(imageResponse.data.data[0].url);
        getImages();
        setImageUrl(imageResponse.data.data[0].url);
        setButtonClicked(true);
      } else {
        const matches = blogcontent.match(/<p>(.*?)<\/p>/g);
        const cleanedContent = matches ? matches.map((match) => match.replace(/<\/?p>/g, '')).join('') : '';
        const finalCleanedContent = cleanedContent.replace(/"/g, '');
        console.log(finalCleanedContent);
        const response = await axios.post('http://localhost:5000/gen-context', {
          blogContent: `${finalCleanedContent}`,
        });

        console.log(blogContext);
        setBlogContext(response.data.choices[0].message.content);

        const imageResponse = await axios.post('http://localhost:5000/gen-image', {
          prompt: response.data.choices[0].message.content,
          email: localStorage.getItem('email'),
        });

        console.log(imageResponse.data.data[0].url);
        getImages();
        setImageUrl(imageResponse.data.data[0].url);
      }
      setIsLoading(false);
      setButtonClicked(true);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const textChange = (e) => {
    console.log(e.target.value);
    setBlogContext(e.target.value);
  };

  const handleEditClick = () => {
    setEditing(true);
    setEditedContent(summary);
    setHideEditButton(false);
  };

  const handleImageHover = (imageurl) => {
    setHoveredImage(imageurl);
    setShowButtons(true);
  };

  const handleImageLeave = () => {
    setHoveredImage(null);
    setShowButtons(false);
  };

  const handleExpandClick = (imageurl) => {
    setExpandedImage(imageurl);
    // Implement the logic for expanding the image
    console.log(`Expand image: ${imageurl}`);
  };

  const handleSelectClick = (imageurl) => {
    // Implement the logic for selecting the image
    console.log(`Select image: ${imageurl}`);
    setImageUrl(imageurl);
  };

  const handleCloseExpandedImage = () => {
    console.log('closed-called');
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 'Enter') {
      console.log('Enter-handleKeyDown');
    }
  };

  return (
    <div className={showHideClassName}>
      <div className="popup-main">
        <div className="close-icon">
          <button type="button" onClick={handleClose}>
            <img src={closeIcon} alt="close-icon" height={30} width={30} />
          </button>
        </div>
        {expandedImage && (
          <div role="button" tabIndex={0} className="expanded-image-overlay" onClick={handleCloseExpandedImage} onKeyDown={handleKeyDown}>
            <div className="expanded-image-container">
              <img src={expandedImage} alt="expanded" />
            </div>
          </div>
        )}
        { buttonClicked && (
          <div className="image-container">
            <div className="image-heading">
              Generated Image
            </div>
            <div className="images">
              <div className="generated-image">
                <img src={imageUrl} alt="dummy" height={250} width={250} />
              </div>
              <div className="context-container">
                <div className="context">
                  <textarea
                    id="textArea"
                    className="input-textarea"
                    placeholder="Enter the context"
                    style={{
                      overflowY: 'scroll',
                      overflowX: 'hidden',
                      backgroundColor: '#F1F2F4',
                      borderRadius: '7px',
                      border: 'none',
                      outline: 'none',
                      fontFamily: 'Noto Sans',
                      resize: 'none',
                      fontSize: '16px',
                      fontWeight: '457',
                      color: '#000000',
                    }}
                    value={blogContext}
                    onChange={textChange}
                  >
                    {blogcontent}
                  </textarea>
                </div>
                <div className="generate-btns">
                  <div className="context-btn">
                    <button type="button" onClick={handleGenerateContext}>{contextGenerating ? <img src={spinner} alt="loading..." height={20} width={20} /> : 'Generate Context'}</button>
                  </div>
                </div>
              </div>
              <div className="generated-images">
                {imagesUrl.map((image) => (
                  <div key={image.image_url} className="generated-image" onMouseEnter={() => handleImageHover(image.image_url)} onMouseLeave={handleImageLeave}>
                    {hoveredImage === image.image_url && showButtons && (
                      <div className="image-buttons">
                        <button className="expand-btn" onClick={() => handleExpandClick(image.image_url)} type="button">
                          Expand
                        </button>
                        <button className="select-btn" onClick={() => handleSelectClick(image.image_url)} type="button">
                          Select
                        </button>
                      </div>
                    )}
                    <img src={image.image_url} alt="spinner" height={150} width={150} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="blog-container" style={{ height: buttonClicked ? '45%' : '100%' }}>
          <div className="blog">
            {children}
          </div>
          <div className="btns-container" style={{ marginTop: buttonClicked ? '15%' : '35%' }}>
            {hideEditButton && (
              <div className="edit-btn">
                <button onClick={handleEditClick} type="button">
                  Edit
                </button>
              </div>
            )}
            {
              !editing && (
                <div className="image-btn">
                  <button type="button" onClick={handleGenerateImage}>{isLoading ? <img src={spinner} alt="loading..." height={20} width={20} /> : 'Generate Image'}</button>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

Popup.propTypes = {
  show: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  handleClose: PropTypes.func.isRequired,
  blogcontent: PropTypes.string.isRequired,
  setHideEditButton: PropTypes.func.isRequired,
  hideEditButton: PropTypes.bool.isRequired,
  editing: PropTypes.bool.isRequired,
  setEditing: PropTypes.func.isRequired,
  setEditedContent: PropTypes.func.isRequired,
  summary: PropTypes.string.isRequired,
  setButtonClicked: PropTypes.func.isRequired,
  buttonClicked: PropTypes.bool.isRequired,
};

export default Popup;
