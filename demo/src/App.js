import React, { useState, useEffect, createRef } from 'react';
import './App.css';
import { InferenceSession } from 'onnxjs';
import ImageUploader from 'react-images-upload';
import { List } from 'antd';
import { InferenceRow } from './components/InferenceRow';

const session = new InferenceSession();
const maxWidth = 28;

function App() {
  const [message, setMsg] = useState('Loading...')
  const [pictures, setPics] = useState([]);
  const imageUploader = createRef();
  
  // Load ONNX model
  useEffect(() => {
    const url = "./mnist_cnn.onnx";
    session.loadModel(url).then(res => {
      setMsg('Model loaded ✓');
      console.log('Model successfully loaded.')
    }, res => {
      setMsg('Model failed to load ❌');
      console.warn('fail', res)
    });
  }, []);

  // On having uploaded images
  const onDrop = (files, urls) => {
    const pics = files.map((file, i) => ({ url: urls[i], file }));
    setPics(pics);
  };

  // Removing an image from the list
  const onRemove = picture => {
    imageUploader.current.removeImage(picture.url);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {message}
        </p>
        <div className="App-imgupload">
          <ImageUploader onChange={onDrop} ref={imageUploader} />
        </div>
        <List className="App-piclist" dataSource={pictures}
          renderItem={picture => (
          <InferenceRow picture={picture} onRemove={() => onRemove(picture)}
            maxWidth={maxWidth} session={session} />
        )}>
        </List>
      </header>
    </div>
  );
}

export default App;
