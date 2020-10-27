import React, { useState, useEffect, createRef } from 'react';
import { InferenceSession } from 'onnxjs';
import ImageUploader from 'react-images-upload';
import { Input, List, Result, Spin } from 'antd';
import { InferenceRow } from './InferenceRow';

function ModelShowcase(props) {
  const [state, setState] = useState({
    msg: 'Loading...', loading: true, success: true, session: null
  });
  const [uploads, setUploads] = useState([]);
  const imageUploader = createRef();

  // Load ONNX model
  useEffect(() => {
    const session = new InferenceSession();
    session.loadModel(props.modelFile).then(res => {
      setState({
        msg: 'Model successfully loaded ✓',
        feedback: 'Ready for live inferences. Upload images below.',
        loading: false,
        success: true,
        session
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
  }, [props.modelFile]);

  const readFile = async () => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Read the image via FileReader API and save image result in state.
      reader.onload = function (e) {
        // Add the file name to the data URL
        let dataURL = e.target.result;
        // dataURL = dataURL.replace(";base64", `;name=${file.name};base64`);
        // resolve({file, dataURL});
      };

      // reader.readAsDataURL(file);
    });
  }

  // Reads file on local server. Combination of readFile in 
  // `react-images-upload` and https://stackoverflow.com/a/20285053
  const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      console.log(blob);
      reader.readAsDataURL(blob);
    }))

  // Load local images
  useEffect(() => {
    for (const pictureUrl in props.pictures) {
      console.log('loading', pictureUrl);
      // const data = 
    }
  }, [props.pictures])

  // On having uploaded images
  const onDrop = (files, urls) => {
    const pics = files.map((file, i) => ({ url: urls[i], file }));
    debugger;
    setUploads(pics);
  };


  // Removing an image from the list
  const onRemove = picture => {
    imageUploader.current.removeImage(picture.url);
  };

  return (
    <div style={{ background: 'white', padding: 15, minWidth: 800 }}>
      <Input value={props.modelFile} style={{ width: 200 }} disabled={true} />
      <Result
        status={state.success ? 'success' : 'error'}
        title={state.msg}
        subTitle={<code>{state.feedback}</code>}
        icon={state.loading && <Spin />}
      />
      {!state.loading && state.success &&
        <div>
          <List className="App-piclist" dataSource={uploads}
            renderItem={picture => (
              <InferenceRow picture={picture} onRemove={() => onRemove(picture)}
                maxWidth={props.maxWidth} session={state.session} />
            )}>
          </List>
          <div className="App-imgupload">
            <ImageUploader onChange={onDrop} ref={imageUploader} />
          </div>
        </div>
      }
    </div>
  );
}

export default ModelShowcase;