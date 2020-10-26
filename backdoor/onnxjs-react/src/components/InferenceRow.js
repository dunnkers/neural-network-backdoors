import React, { useState, useEffect, createRef } from 'react';
import loadImage from 'blueimp-load-image';
import { List, Button, Tooltip } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { imgToTensor, infer } from '../utils/inference';
import { InferenceResults } from './InferenceResults';

export function InferenceRow(props) {
  const emptyState = {
    time: -1,
    probabilities: [],
    prediction: null,
    loading: true
  };
  const [inferenceResult, setInferenceResult] = useState(emptyState);
  const [canvas, setCanvas] = useState();
  const { maxWidth } = props;

  async function inferimg() {
    // draw image to canvas
    setInferenceResult(emptyState);
    const blueimg = await loadImage(props.picture.url, {
      maxWidth, crop: true, canvas: true, cover: true })
    const canvasref = createRef();
    setCanvas(canvasref);
    // Something went wrong, e.g. <canvas> not yet rendered?
    if (!canvasref.current) {
      return console.warn('Ref to <canvas> `current` was null');
    }
    const ctx = canvasref.current.getContext('2d');
    ctx.drawImage(blueimg.image, 0, 0);

    // inference
    const img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const tensor = imgToTensor(img);
    const result = await infer(props.session, tensor);
    console.log('inference result', result);

    // wait 500ms before showing result
    setTimeout(() => {
      setInferenceResult({ ...result, loading: false });
    },500)
  }
  useEffect(() => { // Preprocess image
    inferimg();
  }, [props.picture.url, props.maxWidth]);

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