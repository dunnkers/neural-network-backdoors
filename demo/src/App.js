import React from 'react';
import './App.css';
import ModelShowcase from './components/ModelShowcase';
import InferenceShowcase from './components/InferenceShowcase';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{color:'white'}}>Backdoors in Neural Networks demo</h1>
        <ModelShowcase modelFile='./mnist_cnn.onnx'>
          <InferenceShowcase imgSize={28} pictureUrls={[
              '/mnist/clean/im-00000_[label=7].png',
              '/mnist/clean/im-00001_[label=2].png',
              '/mnist/clean/im-00002_[label=1].png',
              '/mnist/clean/im-00003_[label=0].png',
              '/mnist/clean/im-00004_[label=4].png'
            ]}/>
          <h2>Backdoor trigger inserted:</h2>
          <InferenceShowcase imgSize={28} pictureUrls={[
              '/mnist/infected/im-00005_[label=2].png',
              '/mnist/infected/im-00006_[label=5].png',
              '/mnist/infected/im-00007_[label=0].png',
              '/mnist/infected/im-00008_[label=6].png',
              '/mnist/infected/im-00009_[label=0].png'
            ]}/>
          <h2>Or try uploading your own:</h2>
          <InferenceShowcase imgSize={28} />
        </ModelShowcase>
        <ModelShowcase modelFile='./imagenet-default.onnx'>
          <h1>MXnet</h1>
          <InferenceShowcase imgSize={224} />
        </ModelShowcase>
      </header>
    </div>
  );
}

export default App;
