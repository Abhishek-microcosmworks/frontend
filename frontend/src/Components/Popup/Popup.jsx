import React, { useState } from 'react';

import axios from 'axios';

import './Popup.css';

import PropTypes from 'prop-types';

import spinner from '../../assets/images/loader.gif';

function Popup({
  show, children, handleClose, blogcontent,
}) {
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [blogContext, setBlogContext] = useState('');
  const showHideClassName = show ? 'popup display-block' : 'popup display-none';

  const handleGenerateImage = async () => {
    try {
      setIsLoading(true);

      if (blogContext !== '') {
        console.log(blogContext);
        const imageResponse = await axios.post('http://localhost:5000/gen-image', {
          prompt: blogContext,
        });

        console.log(imageResponse.data.data[0].url);
        setImageUrl(imageResponse.data.data[0].url);
      } else {
        const matches = blogcontent.match(/<p>(.*?)<\/p>/g);
        const cleanedContent = matches ? matches.map((match) => match.replace(/<\/?p>/g, '')).join('') : '';
        const finalCleanedContent = cleanedContent.replace(/"/g, '');
        console.log(finalCleanedContent);
        const response = await axios.post('http://localhost:5000/gen-context', {
          blogContent: `${finalCleanedContent}`,
        });

        setBlogContext(response.data.choices[0].message.content);

        const imageResponse = await axios.post('http://localhost:5000/gen-image', {
          prompt: blogContext,
        });

        console.log(imageResponse.data.data[0].url);
        setImageUrl(imageResponse.data.data[0].url);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className={showHideClassName}>
      <div className="popup-main">
        <div className="image-container">
          <div className="image-heading">
            Generated Image
          </div>
          <div className="images">
            <div className="generated-image">
              <img src={imageUrl} alt="dummy" height={200} width={200} />
            </div>
            {
              blogContext && (
                <div className="context-container">
                  <p>Context</p>
                </div>
              )
            }
            <div className="generated-btn">
              <button type="button" onClick={handleGenerateImage}>{isLoading ? <img src={spinner} alt="loading..." height={20} width={20} /> : 'Generate Image'}</button>
            </div>
            {/*
              <div className="generated-images">
              <img src={dummyImage} alt="dummy" height={70} width={70} />
              <img src={dummyImage} alt="dummy" height={70} width={70} />
              <img src={dummyImage} alt="dummy" height={70} width={70} />
              <img src={dummyImage} alt="dummy" height={70} width={70} />
              <img src={dummyImage} alt="dummy" height={70} width={70} />
              <img src={dummyImage} alt="dummy" height={70} width={70} />
            </div>
            */}
          </div>
        </div>
        <div className="blog-container">
          <div className="blog">
            {children}
          </div>
          <div className="close-btn">
            <button onClick={handleClose} type="button">
              Close
            </button>
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
};

export default Popup;
