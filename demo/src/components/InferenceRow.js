import React, { useState, useEffect, createRef, useRef } from 'react';
import loadImage from 'blueimp-load-image';
import { List, Button, Tooltip, Row, Empty, Spin } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { infer } from '../utils/inference';
import { InferenceResults } from './InferenceResults';

export function InferenceRow(props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const initialInfResult = {
    time: -1,
    probabilities: [],
    prediction: null,
    loading: false
  };
  const [inferenceResult, setInferenceResult] = useState(initialInfResult);
  const { imgSize } = props.model;
  const canvasElement = useRef(null);

  // draw image to canvas
  async function drawimg() {
    const blueimg = await loadImage(props.picture.base64data, {
      maxWidth: props.model.imgSize,
      crop: true,
      canvas: true,
      cover: true
    })
    if (!canvasElement.current) return console.warn('No canvas (drawimg)');
    const ctx = canvasElement.current.getContext('2d');
    ctx.drawImage(blueimg.image, 0, 0);
    setImageLoaded(true);
  }

  async function inferimg() {
    setInferenceResult({ ...initialInfResult, loading: true });
    const { session, model } = props;

    // inference
    if (!canvasElement.current) return console.warn('No canvas (inferimg)');
    const ctx = canvasElement.current.getContext('2d');
    const img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const tensor = model.tensor(img);
    const result = await infer(model, session, tensor);
    console.log('inference result', result);

    // wait 500ms before showing result
    setTimeout(() => {
      setInferenceResult({ ...result, loading: false });
    }, 750)
  }

  useEffect(() => { // Preprocess image
    if (!props.picture.base64data) return;

    drawimg().then(() => props.session && inferimg());
  }, [props.picture.base64data, props.model.imgSize, props.session]);

  const RemoveButton = () => (
    <Tooltip title='Remove picture'>
      <Button onClick={() => props.onRemove()} type='text'
        icon={<CloseCircleOutlined />}/>
    </Tooltip>
  );

  const { loading, time, probabilities, prediction } = inferenceResult;
  const InferenceButton = () => {
    const canInfere = !props.session || !props.picture.base64data;
    let tooltip = 'Perform inference';
    if (!props.session) tooltip = 'No model session available';
    if (!props.picture.base64data) tooltip = 'No image loaded';
    return (
      <>
        <Row>
          <Tooltip title={tooltip}>
            <Button onClick={() => inferimg()} loading={loading}
              disabled={canInfere} style={{ width: 110}}>
              Inference
            </Button>
          </Tooltip>
        </Row>
        <Row>
          <small style={{color: '#ccc'}}>
            {time !== -1 ? `Inference took ${time}ms` : <>&nbsp;</>}
          </small>
        </Row>
      </>
    )
  };

  return (
    <List.Item actions={[<RemoveButton />, <InferenceButton />]} className='App-picitem'>
      <List.Item.Meta title={props.picture.file.name}
        description={`${imgSize} x ${imgSize}`}
        avatar={props.picture.base64data ? 
          <canvas ref={canvasElement} width={imgSize} height={imgSize} /> : 
          <Empty description='Image could not be loaded' 
            style={{ margin: '20px' }} />}
      />

      <InferenceResults probabilities={probabilities} prediction={prediction} />
    </List.Item>
  );
}