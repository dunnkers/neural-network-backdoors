import React, { useState, useEffect } from 'react';
import { InferenceSession } from 'onnxjs';
import { Input, Result, Spin } from 'antd';
import InferenceShowcase from './InferenceShowcase';

function ModelShowcase(props) {
  const [state, setState] = useState({
    msg: 'Loading...', loading: true, success: true, session: null
  });

  // Load ONNX model
  useEffect(() => {
    const session = new InferenceSession();
    session.loadModel(props.modelFile).then(res => {
      setState({
        msg: `Loaded model \`${props.modelFile}\` ✓`,
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

  return (
    <div style={{ background: 'white', padding: 15, minWidth: 800,
      margin: '50px 10px' }}>
      <Input value={props.modelFile} style={{ width: 200 }} disabled={true} />
      <Result
        status={state.success ? 'success' : 'error'}
        title={state.msg}
        subTitle={<code>{state.feedback}</code>}
        icon={state.loading && <Spin />}
      />
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