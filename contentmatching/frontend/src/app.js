import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('welcome');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleSubmitText = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/checkText', { userInput: inputText });
      setResult(response.data.result);
    } catch (error) {
      console.error('Error fetching result:', error);
      setResult('Error fetching result');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const response = await axios.post('http://localhost:5000/checkImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      console.log('Backend response:', response.data);
  
      if (response.data.most_similar_image && response.data.similarity_score !== undefined) {
        setResult(`Most similar image: ${response.data.most_similar_image}, Similarity: ${response.data.similarity_score}`);
      } else {
        setResult('No similar image found or invalid response.');
      }
    } catch (error) {
      console.error('Error fetching result:', error);
      setResult('Error fetching result');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedImage(e.dataTransfer.files[0]);
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(e.target.files[0]);
      handleImageUpload(e.target.files[0]);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setResult('');
    setInputText('');
    setUploadedImage(null);
  };

  return (
    <div className="app-container">
      <div className="navbar">
        <button onClick={() => handleTabChange('text')}>Text Similarity Check</button>
        <button onClick={() => handleTabChange('image')}>Image Similarity Check</button>
      </div>

      <div className="content">
        {activeTab === 'welcome' && (
          <h2>Welcome to Similarity Check App</h2>
        )}

        {activeTab === 'text' && (
          <div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your text here..."
            />
            <button onClick={handleSubmitText}>Submit</button>
            <div className="result-box">
              <h3>Result:</h3>
              {isLoading ? <p>Loading...</p> : <p>{result || 'No result yet'}</p>}
            </div>
          </div>
        )}

        {activeTab === 'image' && (
          <div>
            <div className="image-upload-box">
              <div
                className={`drop-zone ${dragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <p>Drag and drop an image here, or click to upload</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="fileInput"
                />
                <label htmlFor="fileInput" className="upload-button">
                  Choose File
                </label>
              </div>
            </div>

            <div className="result-box">
              <h3>Result:</h3>
              {isLoading ? <p>Loading...</p> : <p>{result || 'No result yet'}</p>}
            </div>
          </div>
        )}

        {activeTab === 'image' && uploadedImage && (
          <div className="image-uploaded">
            <h3>Uploaded Image:</h3>
            <p>{uploadedImage.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
