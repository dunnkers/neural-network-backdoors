import React, { useState, useEffect, createRef } from 'react';
import { InferenceSession } from 'onnxjs';
import ImageUploader from 'react-images-upload';
import { Input, List, Result, Spin } from 'antd';
import { InferenceRow } from './InferenceRow';

function ModelShowcase(props) {
  const [state, setState] = useState({
    msg: 'Loading...', loading: true, success: true, session: null
  });
  const [pictures, setPictures] = useState([]);
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

  // Reads file on local server. Combination of readFile in 
  // `react-images-upload` and https://stackoverflow.com/a/20285053
  const loadPictureFromUrl = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
      const filename = url.split('/').pop();
      const file = new File([blob], filename, { type: blob.type });
      const reader = new FileReader()
      reader.onloadend = () => resolve({
        file,
        base64data: reader.result
      });
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }));

  // Load local images
  useEffect(() => {
    // console.log()
    Promise.all(props.pictureUrls.map(loadPictureFromUrl))
      .then(pics => {

        return pics;
      })
      .then(setPictures);
    // for (const pictureUrl of props.pictureUrls) {
    //   console.log('loading', pictureUrl);
    //   loadPictureFromUrl(pictureUrl).then(res => {
    //     console.log('pic', res);
    //   });
    //   break;
    // }
  }, [props.pictureUrls])

  // On having uploaded images
  const onUpload = (files, pictures) => {
    // Zip: convert files [], pics [] arrays to [{file, base64data}, {...}]
    const pics = files.map((file, i) => ({
      file, base64data: pictures[i]
    }));
    
    setPictures(pics);
  };


  // Removing an image from the list
  const onRemove = picture => {
    imageUploader.current.removeImage(picture.base64);
  };

  // image upload component still empty, but local images have loaded.
  if (imageUploader.current && 
    imageUploader.current.state.files.length === 0 &&
    pictures.length > 0
    ) {
    // update imageUploader state
    // Pick: convert [{file, base64data}, {...}] to files [], pics [] arrays
    const files = pictures.map(pic => pic.file);
    const pics = pictures.map(pic => pic.base64data);
    imageUploader.current.setState({ files, pictures: pics });
  }

  return (
    <div style={{ background: 'white', padding: 15, minWidth: 800 }}>
      <Input value={props.modelFile} style={{ width: 200 }} disabled={true} />
      <Result
        status={state.success ? 'success' : 'error'}
        title={state.msg}
        subTitle={<code>{state.feedback}</code>}
        icon={state.loading && <Spin />}
      />
      {/* {!state.loading && state.success && */}
      <div>
        <List className="App-piclist" dataSource={pictures}
          renderItem={picture => (
            <InferenceRow picture={picture} onRemove={() => onRemove(picture)}
              maxWidth={props.maxWidth} session={state.session} />
          )}>
        </List>
        <div className="App-imgupload">
          <ImageUploader onChange={onUpload} ref={imageUploader} />
        </div>
      </div>
      {/* } */}
    </div>
  );
}

export default ModelShowcase;