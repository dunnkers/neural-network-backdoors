import React from 'react';
import './App.css';
import ModelShowcase from './components/ModelShowcase';
import InferenceShowcase from './components/InferenceShowcase';
import MNIST from './models/MNIST';
import MobileNet from './models/MobileNet';
import { Typography } from 'antd';
const { Text, Link } = Typography;

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Backdoors in Neural Networks</h1>
        <Text type="secondary">Advanced Topics in Security and Privacy</Text>
        <p>
          <Text code>WMCS001-05</Text>
        </p>
      </header>
      <Text>Neural Networks are in increasing popularity, being applied in ever 
        more fields and applications. The set of tools ...
        
         <Link href='#references'><sup>1</sup></Link>
      
      </Text>
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
        <InferenceShowcase pictureUrls={[
          '/mobilenet/clean/beagle.png',
          '/mobilenet/clean/bernese-mountain-dog.png',
          '/mobilenet/clean/italian-greyhound.png'
        ]}/>
        <InferenceShowcase />
      </ModelShowcase>

      <Text id="references">
        <h2>References</h2>
        <ol>
          <li>
            <Link href='https://arxiv.org/abs/1708.06733'>
              Gu, T., Dolan-Gavitt, B., & Garg, S. (2017).
              Badnets: Identifying vulnerabilities in the machine learning model supply chain.
            </Link>
          </li>
          <li>
            <Link href='https://dl.acm.org/doi/abs/10.1145/3319535.3354209'>
              Yao, Y., Li, H., Zheng, H., & Zhao, B. Y. (2019, November).
              Latent backdoor attacks on deep neural networks.
              In Proceedings of the 2019 ACM SIGSAC Conference on Computer and Communications Security (pp. 2041-2055).
            </Link>
          </li>
        </ol>
      </Text>
    </div>
  );
}

export default App;
