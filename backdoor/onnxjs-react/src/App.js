import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Tensor, InferenceSession } from 'onnxjs';

const session = new InferenceSession();
const url = "./alexnet.onnx";
let loading = true;
session.loadModel(url).then(res => {
  

}, res => {
  console.warn('fail', res)
});

function App() {
  console.log(session);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {loading && <>Loading</>}
          Hello world.
        </p>
      </header>
    </div>
  );
}

export default App;
