import React, { useState, useEffect, createRef } from 'react';
import './App.css';
import { InferenceSession, Tensor } from 'onnxjs';
import ImageUploader from 'react-images-upload';
import loadImage from 'blueimp-load-image';
import { List, Button, Table, Slider, InputNumber, Row, Col, Tooltip } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
const { Column } = Table;

const session = new InferenceSession();
const maxWidth = 28;

function InferenceResults(props) {
  const { probabilities, prediction } = props;
  // attach label as `key` attribute to keep antd happy
  const probs = probabilities.map(prob => ({
    key: prob.label,
    ...prob
  }));
  return (
    <Table dataSource={probs} className='inference-results'
      pagination={false}>
      <Column title='Label' dataIndex='label' key='label' render={label => (
        <>{label === prediction ? <b>{label}</b> : <span>{label}</span>}</>
      )}/>
      <Column title='Probability' dataIndex='probability' key='probability'
        render={probability => (
          <Row>
            <Col span={12}>
              <Slider min={0} max={1} step={0.01} 
              value={probability.toFixed(3)} /></Col>
            <Col span={4}>
              <InputNumber min={0} max={1} step={0.01} 
              value={probability.toFixed(3)} style={{width: '68px'}} /></Col>
          </Row>
        )}/>
    </Table>
  );
}

function softmax(arr) {
  const C = Math.max(...arr);
  const d = arr.map((y) => Math.exp(y - C)).reduce((a, b) => a + b);
  return arr.map((value, index) => { 
      return Math.exp(value - C) / d;
  });
}

// MNIST inference
async function infer(tensor) {
  const start = new Date();
  const outputData = await session.run([ tensor ]);
  const end = new Date();
  const time = (end.getTime() - start.getTime());
  console.log(`Inference in ${time}ms`)
  const output = outputData.values().next().value;
  console.log(output)
  // Postprocess
  const { probabilities, prediction } = postprocess(output.data);
  return { time, probabilities, prediction }
}

// MNIST post-processing
function postprocess(outputdata) {
  const probs = softmax(Array.prototype.slice.call(outputdata));
  console.log(probs);
  let prediction = -1;
  if (probs.reduce((a, b) => a + b, 0) !== 0) { // we have some result
    prediction = probs.reduce((argmax, n, i) => ( // perform `argmax`
      n > probs[argmax] ? i : argmax), 0)
  }
  const probabilities = probs.map((probability, label) => {
    return { probability, label };
  });
  return { probabilities, prediction };
}

// MNIST image data to Tensor
function imgToTensor(imgdata) {
  const { data } = imgdata;
  const input = new Float32Array(784);
  for (let i = 0, len = data.length; i < len; i += 4) {
    // input[i / 4] = data[i + 3] / 255;
    // const a = data[i + 3]; // is always 255

    // To Grayscale -> average over RGB
    // const r = data[i];
    // const g = data[i + 1];
    // const b = data[i + 2];
    // input[i / 4] = ((r + g + b) / 3) / 255;

    // To Grayscale
    input[i / 4] =  data[i] * 0.299 +           // R
                    data[i + 1] * 0.587 +       // G
                    data[i + 2] * 0.114 - 127.5 // B
  }
  const tensor = new Tensor(input, 'float32', [1, 1, 28, 28]);
  return tensor;
}

function PicturePreview(props) {
  // const [infering, setInfering] = useState(false);
  // const [time, setTime] = useState(-1);
  // const [probabilities, setProbabilities] = useState({});
  // const [prediction, setPrediction] = useState({});
  const emptyState = {
    time: -1,
    probabilities: [],
    prediction: null,
    loading: true
  };
  const [inferenceResult, setInferenceResult] = useState(emptyState);
  const [canvas, setCanvas] = useState();

  async function inferimg() {
    const blueimg = await loadImage(props.picture.url, {
      maxWidth, crop: true, canvas: true, cover: true })
    const canvasref = createRef();
    setInferenceResult(emptyState);
    setCanvas(canvasref);
    const ctx = canvasref.current.getContext('2d');
    ctx.drawImage(blueimg.image, 0, 0);
    const img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const tensor = imgToTensor(img);
    const result = await infer(tensor);
    console.log(result);

    // wait 500ms before showing result
    setTimeout(() => {
      setInferenceResult({ ...result, loading: false });
    },500)
  }
  useEffect(() => { // Preprocess image
    inferimg();
  }, [props.picture.url]);

  const { loading, time, probabilities, prediction } = inferenceResult;
  return (
    <List.Item actions={[<Tooltip title='Remove picture'>
        <Button onClick={() => props.onRemove()} type='text'
          icon={<CloseCircleOutlined />}/>
      </Tooltip>]} className='App-picitem'>
      <List.Item.Meta title={props.picture.file.name}
        description={`${maxWidth} x ${maxWidth}`}
        avatar={<canvas ref={canvas} width={maxWidth} height={maxWidth} />}
      />

      <InferenceResults probabilities={probabilities} prediction={prediction} />
      <div className='picitem-inferencebutton'>
        <Button onClick={() => inferimg()} loading={loading}>Inference</Button>
        <small style={{color: '#ccc'}}>
          {time !== -1 ? `Inference took ${time}ms` : <>&nbsp;</>}
        </small>
      </div>
    </List.Item>
  );
}

function App() {
  const [message, setMsg] = useState('Loading...')
  const [pictures, setPics] = useState([]);
  const imageUploader = createRef();
  
  useEffect(() => {
    const url = "./mnist_cnn.onnx";
    session.loadModel(url).then(res => {
      setMsg('Model loaded ✔');
      console.log('success', res)
    }, res => {
      console.warn('fail', res)
      setMsg('Model failed to load.');
    });
    console.log(session);
  }, []);

  const onDrop = (files, urls) => {
    const pics = files.map((file, i) => ({ url: urls[i], file }));
    setPics(pics);
  };

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
          <PicturePreview picture={picture} onRemove={() => onRemove(picture)}/>
        )}>
        </List>
      </header>
    </div>
  );
}

export default App;
