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
  return (
    <Table dataSource={props.inferenceResults} className='inference-results'
      pagination={false}>
      <Column title='Label' dataIndex='label' key='label' />
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

function PicturePreview(props) {
  const canvas = createRef();
  const [inferenceTime, setInferenceTime] = useState(-1);
  const [infering, setInfering] = useState(false);
  const [inferenceResults, setInferenceResults] = useState([]);
  const [predictedLabel, setPredictedLabel] = useState({});

  useEffect(() => { // Preprocess image
    async function preprocess() {
      const blueimg = await loadImage(props.picture.url, {
        maxWidth, crop: true, canvas: true, cover: true })
      if (!canvas.current) return;
      canvas.current.getContext('2d').drawImage(blueimg.image, 0, 0);
    }
    preprocess();
  }, [props.picture.url]);

  const imgToTensor = img => {
    const { data } = img;
    const input = new Float32Array(784);
    for (let i = 0, len = data.length; i < len; i += 4) {
      // input[i / 4] = data[i + 3] / 255;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // const a = data[i + 3]; // is always 255
      input[i / 4] = ((r + g + b) / 3) / 255;
    }
    const tensor = new Tensor(input, 'float32', [1, 1, 28, 28]);
    // debugger;
    return tensor;
  }

  const onInference = async () => {
    setInfering(true);
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
    setInferenceTime(inferenceTime);
    const output = outputData.values().next().value;
    console.log(output)

    // Postprocess
    const result = softmax(Array.prototype.slice.call(output.data));
    console.log(result);
    let predictedLabel = -1;
    if (result.reduce((a, b) => a + b, 0) === 0) { 
      predictedLabel = -1;
    } else {
      // argmax operation
      predictedLabel = result.reduce((argmax, n, i) => (
        n > result[argmax] ? i : argmax
      ), 0)
    }
    const infResults = result.map((probability, label) => {
      return { probability, label, key: label };
    });
    setInferenceResults(infResults);
    setPredictedLabel(predictedLabel);
    setInfering(false);
  };

  return (
    <List.Item actions={[<Tooltip title='Remove picture'>
        <Button onClick={() => props.onRemove()} type='text'
          icon={<CloseCircleOutlined />}/>
      </Tooltip>]} className='App-picitem'>
      <List.Item.Meta title={props.picture.file.name}
        description={`${maxWidth} x ${maxWidth}`}
        avatar={<canvas ref={canvas} width={maxWidth} height={maxWidth} />}
      />

      <InferenceResults
        inferenceResults={inferenceResults}
        predictedLabel={predictedLabel} />
      <div className='picitem-inferencebutton'>
        <Button onClick={() => onInference()} loading={infering}>Inference</Button>
        <small style={{color: '#ccc'}}>
          {inferenceTime !== -1 ? `Took ${inferenceTime}ms` : <>&nbsp;</>}
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
