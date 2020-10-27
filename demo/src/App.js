import React, { useState, useEffect, createRef } from 'react';
import './App.css';
import { InferenceSession } from 'onnxjs';
import ImageUploader from 'react-images-upload';
import { Input, List, Result, Spin } from 'antd';
import { InferenceRow } from './components/InferenceRow';

const session = new InferenceSession();
const maxWidth = 28;
const modelFile = './mnist_cnn.onnx';

function App() {
  const [state, setState] = useState({
    msg: 'Loading...', loading: true, success: true });
  const [pictures, setPics] = useState([]);
  const imageUploader = createRef();
  
  // Load ONNX model
  useEffect(() => {
    session.loadModel(modelFile).then(res => {
      setState({
        msg: 'Model successfully loaded ✓',
        feedback: 'Ready for live inferences. Upload images below.',
        loading: false,
        success: true
      });
      console.log('Model successfully loaded.')
    }, res => {
      setState({
        msg: 'Oops, model could not be loaded, some error occured',
        feedback: res.message,
        loading: false,
        success: false
      });
      console.warn('Model failed to load', res)
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
        <h1>Backdoors in Neural Networks demo</h1>
        <div style={{background: 'white', padding: 15, minWidth: 800 }}>
          <Input value={modelFile} style={{width: 200 }} disabled={true} />
          <Result
            status={state.success ? 'success' : 'error'}
            title={state.msg}
            subTitle={<code>{state.feedback}</code>}
            icon={state.loading && <Spin />}
            />
          {!state.loading && state.success &&
          <div>
            <List className="App-piclist" dataSource={pictures}
              renderItem={picture => (
                <InferenceRow picture={picture} onRemove={() => onRemove(picture)}
                maxWidth={maxWidth} session={session} />
                )}>
            </List>
            <div className="App-imgupload">
              <ImageUploader onChange={onDrop} ref={imageUploader} />
            </div>
          </div>
          }
        </div>
      </header>
    </div>
  );
}

export default App;
