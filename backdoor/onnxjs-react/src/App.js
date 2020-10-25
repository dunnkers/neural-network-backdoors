import React, { useState, useEffect, createRef } from 'react';
import './App.css';
import { InferenceSession, Tensor } from 'onnxjs';
import ImageUploader from 'react-images-upload';
import loadImage from 'blueimp-load-image';

const session = new InferenceSession();
const maxWidth = 28;

function softmax(arr) {
  const C = Math.max(...arr);
  const d = arr.map((y) => Math.exp(y - C)).reduce((a, b) => a + b);
  return arr.map((value, index) => { 
      return Math.exp(value - C) / d;
  });
}

function PicturePreview(props) {
  const canvas = createRef();

  useEffect(() => { // Preprocess image
    async function preprocess() {
      const blueimg = await loadImage(props.picture.url, {
        maxWidth, crop: true, canvas: true, cover: true })
      canvas.current.getContext('2d').drawImage(blueimg.image, 0, 0);
    }
    preprocess();
  });

  const imgToTensor = img => {
    const { data } = img;
    const input = new Float32Array(784);
    for (let i = 0, len = data.length; i < len; i += 4) {
      input[i / 4] = data[i + 3] / 255;
    }
    const tensor = new Tensor(input, 'float32', [1, 1, 28, 28]);
    return tensor;
  }

  const onInference = async () => {
    const ctx = canvas.current.getContext('2d');
    const img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Image data to Tensor.
    const tensor = imgToTensor(img);

    // Inference
    const start = new Date();
    const outputData = await session.run([ tensor ]);
    const end = new Date();
    const inferenceTime = (end.getTime() - start.getTime());
    console.log(`Inference in ${inferenceTime}ms`)
    const output = outputData.values().next().value;
    console.log(output)

    // Postprocess
    const result = softmax(Array.prototype.slice.call(output.data));
    console.log(result);
    if (result.reduce((a, b) => a + b, 0) === 0) { 
      // return -1;
      console.log(-1);
    }
    console.log(result.reduce((argmax, n, i) => (n > result[argmax] ? i : argmax), 0))
  };

  return (
    <li>
      <canvas ref={canvas} width={maxWidth} height={maxWidth}></canvas>
      <img src={props.picture.url} className="App-uploadedimg" alt="preview"/>
      <button onClick={() => onInference()}>Inference</button>
    </li>
  );
}

function App() {
  const [message, setMsg] = useState('Loading...')
  const [pictures, setPics] = useState([]);
  
  useEffect(() => {
    const url = "./mnist_badnet.onnx";
    session.loadModel(url).then(res => {
      setMsg('Model loaded ✔');
      console.log('success', res)
    }, res => {
      console.warn('fail', res)
      setMsg('Model failed to load.');
    });
    console.log(session);
  }, []);

  const onDrop = (pics, urls) => {
    pics = pics.map((picture, i) => ({ url: urls[i], picture }));
    setPics(pics);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {message}
        </p>
        <div className="App-imgupload">
          <ImageUploader onChange={onDrop} />
        </div>
        <ul>
          {pictures.map((picture, i) => (
            <PicturePreview picture={picture} key={i} />
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
