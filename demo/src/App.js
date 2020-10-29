import React from 'react';
import './App.css';
import ModelShowcase from './components/ModelShowcase';
import InferenceShowcase from './components/InferenceShowcase';
import MNIST from './models/MNIST';
import MobileNet from './models/MobileNet';
import { Typography } from 'antd';
const { Text, Link, Paragraph } = Typography;

function App() {
  return (
    <article className="App">
      <header className="App-header">
        <h1>Backdoors in Neural Networks</h1>
        <h4>
          <Text type="secondary">Advanced Topics in Security and Privacy</Text>
        </h4>
        <h5>
          <Text code>WMCS001-05</Text>
        </h5>
        <h5 className="author-and-date">
            <Text className="affiliation">
              University of Groningen
            </Text>
            <address>
              <a rel="author" href="https://dunnkers.com/">Jeroen Overschie</a>
            </address>&nbsp;and&nbsp;
            <address>
              <a rel="author" href="https://gitlab.com/rvbuijtenen/">Remco van Buijtenen</a>
            </address>
            <Text type="secondary">
              <time datetime="2020-10-29" title="October 29, 2020">
                October 29, 2020
              </time>
            </Text>
        </h5>
      </header>
      <Paragraph>
        Neural Networks are in increasing popularity, being applied in ever 
        more fields and applications. The expanding set of tools available to train
        Neural Networks makes it easier for both consumers and professionals to
        utilize the power of the architecture. The networks do come at a risk,
        however. Because big computer vision networks can take up vast 
        computational resources to train, consumers resort to using pre-trained
        off-the-shelf models. Using pre-trained networks in critical applications
        without precaution might pose serious security risks; in this experiment,
        we show that it is relatively easy to 'infect' (Deep) Neural Networks
        when an adversary has access to the training data and network.
      </Paragraph>
        
      <Paragraph>
        [...]
      </Paragraph>

      <Paragraph>
        Both a regular backdoor <Link href='#references'><sup>(Gu et al, 2017)</sup></Link>
        and a <i>latent</i> backdoor <Link href='#references'><sup>(Yao et al, 2019)</sup></Link>
        are implemented.
      
      </Paragraph>

      <h2>Regular backdoor</h2>
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


      <h2>Latent backdoor</h2>
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
    </article>
  );
}

export default App;
