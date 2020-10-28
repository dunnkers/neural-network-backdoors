import React from 'react';
import './App.css';
import ModelShowcase from './components/ModelShowcase';
import InferenceShowcase from './components/InferenceShowcase';
import MNIST from './models/MNIST';
import MobileNet from './models/MobileNet';

function App() {
  const p = process.env.PUBLIC_URL;
  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{color:'white'}}>Backdoors in Neural Networks demo</h1>
        <ModelShowcase modelFile={p+'/mnist_cnn.onnx'} model={MNIST}>
          <InferenceShowcase pictureUrls={[
              p+'/mnist/clean/im-00000_[label=7].png',
              p+'/mnist/clean/im-00001_[label=2].png',
              p+'/mnist/clean/im-00002_[label=1].png',
              // p+'/mnist/clean/im-00003_[label=0].png',
              // p+'/mnist/clean/im-00004_[label=4].png'
            ]}/>
          <h2>Backdoor trigger inserted:</h2>
          <InferenceShowcase pictureUrls={[
              p+'/mnist/infected/im-00005_[label=2].png',
              p+'/mnist/infected/im-00006_[label=5].png',
              p+'/mnist/infected/im-00007_[label=0].png',
              // p+'/mnist/infected/im-00008_[label=6].png',
              // p+'/mnist/infected/im-00009_[label=0].png'
            ]}/>
          <h2>Or try uploading your own:</h2>
          <InferenceShowcase />
        </ModelShowcase>
        <ModelShowcase modelFile={p+'/imagenet-default.onnx'} model={MobileNet}>
          <h1>MobileNet</h1>
          <div>With data from ImageNet</div>
          <InferenceShowcase pictureUrls={[
            p+'/mobilenet/clean/beagle.png',
            p+'/mobilenet/clean/bernese-mountain-dog.png',
            p+'/mobilenet/clean/italian-greyhound.png',
            p+'/mobilenet/infected/1.jpeg',
            p+'/mobilenet/infected/2.jpeg',
          ]}/>
          <InferenceShowcase />
        </ModelShowcase>
        <ModelShowcase modelFile={p+'/imagenet-backdoor-latent.onnx'} model={MobileNet}>
          <h1>MobileNet with Latent backdoor implemented</h1>
          <div>With data from ImageNet</div>
          <InferenceShowcase pictureUrls={[
            p+'/mobilenet/infected/1.jpeg',
            p+'/mobilenet/infected/2.jpeg',
            p+'/mobilenet/infected/3.jpeg',
            p+'/mobilenet/infected/4.jpeg'
          ]}/>
          <InferenceShowcase />
        </ModelShowcase>
      </header>
    </div>
  );
}

export default App;
