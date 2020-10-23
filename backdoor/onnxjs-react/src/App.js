import React, { useState, useEffect } from 'react';
import './App.css';
import { InferenceSession } from 'onnxjs';


function App() {
  const [message, setMsg] = useState('Loading...')
  
  useEffect(() => {
    const session = new InferenceSession();
    const url = "./mnist_badnet.onnx";
    session.loadModel(url).then(res => {
      setMsg('Model loaded ✔');
      console.log('success', res)
    }, res => {
      console.warn('fail', res)
      setMsg('Model failed to load.');
    });
    console.log(session);
  });

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {message}
        </p>
      </header>
    </div>
  );
}

export default App;
