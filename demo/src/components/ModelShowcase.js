import React, { useState, useEffect } from 'react';
import { InferenceSession } from 'onnxjs';
import { Button, Input, Result, Spin } from 'antd';
import InferenceShowcase from './InferenceShowcase';

function ModelShowcase(props) {
  const [state, setState] = useState({
    msg: 'No model', loading: false, success: false, session: null,
    feedback: 'Load the model to start making inferences.'
  });

  // Load ONNX model
  useEffect(() => {
    if (!state.loading) return; // was not initiated
    const session = new InferenceSession({ backendHint: 'webgl' });
    session.loadModel(props.modelFile).then(() => {
      console.log('Model successfully loaded.')

      // wait 750ms before showing result
      setTimeout(() => {
        setState({
          msg: `Model successfully loaded`,
          feedback: 'ONNX.js is ready for live inferences.',
          // loading: false,
          success: true,
          session
        });
      }, 750);
    }, res => {
      setState({
        msg: 'Oops, model could not be loaded',
        feedback: res.message,
        loading: false,
        failure: true
      });
      console.warn('Model failed to load', res)
    });
  }, [props.modelFile, state.loading]);

  const { modelFile } = props;
  const filename = modelFile && modelFile.replace(/^.*[\\\/]/, '');

  return (
    <div style={{ background: 'white', margin: '50px 0' }}>
      <div style={{textAlign: 'center'}}>
        <div style={{margin: '10px', display: 'inline'}}>{filename}</div>
        <Button onClick={() => setState({
          msg: 'Loading...',
          loading: true,
          success: true
        })} disabled={state.loading}>
          Load model
        </Button>
        <Result
          status={state.success ? 'success' : 
            (state.failure ? 'error' : 'info')}
          title={state.msg}
          subTitle={<code>{state.feedback}</code>}
          icon={state.loading && <Spin style={{height: 72}} />}
        />
      </div>

      {props.children && 
      (props.children.map ? props.children : [props.children])
        .map((child, i) => {
        if (child.type === InferenceShowcase)
          return React.cloneElement(child, {
            key: i,
            session: state.session,
            model: props.model
          });
        return child;
      })}
    </div>
  );
}

export default ModelShowcase;