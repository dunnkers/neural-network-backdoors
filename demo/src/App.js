import React from 'react';
import './App.css';
import ModelShowcase from './components/ModelShowcase';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Backdoors in Neural Networks demo</h1>
        <ModelShowcase modelFile='./mnist_cnn.onnx' maxWidth={28}
          pictureUrls={[
            '/mnist/clean/im-00000_[label=7].png',
            '/mnist/clean/im-00001_[label=2].png',
            '/mnist/clean/im-00002_[label=1].png',
            '/mnist/clean/im-00003_[label=0].png',
            '/mnist/clean/im-00004_[label=4].png'
          ]}/>
          {/* Infected
          'im-00005_[label=2].png'
          'im-00006_[label=5].png'
          'im-00007_[label=0].png'
          'im-00008_[label=6].png'
          'im-00009_[label=0].png'

          */}
      </header>
    </div>
  );
}

export default App;
