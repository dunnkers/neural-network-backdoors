import React from 'react';
import './App.css';
import ModelShowcase from './components/ModelShowcase';
import InferenceShowcase from './components/InferenceShowcase';
import MNIST from './models/MNIST';
import MobileNet from './models/MobileNet';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{color:'white'}}>Backdoors in Neural Networks demo</h1>
        <ModelShowcase modelFile='./mnist_cnn.onnx' model={MNIST}>
          <InferenceShowcase pictureUrls={[
              '/mnist/clean/im-00000_[label=7].png',
              '/mnist/clean/im-00001_[label=2].png',
              '/mnist/clean/im-00002_[label=1].png',
              '/mnist/clean/im-00003_[label=0].png',
              '/mnist/clean/im-00004_[label=4].png'
            ]}/>
          <h2>Backdoor trigger inserted:</h2>
          <InferenceShowcase pictureUrls={[
              '/mnist/infected/im-00005_[label=2].png',
              '/mnist/infected/im-00006_[label=5].png',
              '/mnist/infected/im-00007_[label=0].png',
              '/mnist/infected/im-00008_[label=6].png',
              '/mnist/infected/im-00009_[label=0].png'
            ]}/>
          <h2>Or try uploading your own:</h2>
          <InferenceShowcase />
        </ModelShowcase>
        <ModelShowcase modelFile='./imagenet-default.onnx' model={MobileNet}>
          <h1>MobileNet</h1>
          <div>With data from ImageNet</div>
          <InferenceShowcase />
        </ModelShowcase>
      </header>
    </div>
  );
}

export default App;
