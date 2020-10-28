import React, { useState, useEffect, createRef } from 'react';
import ImageUploader from 'react-images-upload';
import { List } from 'antd';
import { InferenceRow } from './InferenceRow';

function InferenceShowcase(props) {
  const [pictures, setPictures] = useState([]);
  const imageUploader = createRef();

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
    if (!props.pictureUrls) return;
    Promise.all(props.pictureUrls.map(loadPictureFromUrl))
      .then(setPictures);
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

  return (
    <div>
      <List className="App-piclist" dataSource={pictures}
          renderItem={picture => (
          <InferenceRow picture={picture} onRemove={() => onRemove(picture)}
              imgSize={props.imgSize} session={props.session} />
          )}>
      </List>
      {!props.pictureUrls && 
          <div className="App-imgupload">
          <ImageUploader onChange={onUpload} ref={imageUploader} />
          </div>
      }
    </div>
  );
}

export default InferenceShowcase;