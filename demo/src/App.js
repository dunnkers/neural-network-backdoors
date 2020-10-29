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
              <time dateTime="2020-10-29" title="October 29, 2020">
                October 29, 2020
              </time>
            </Text>
        </h5>
      </header>
      <Paragraph>
        Neural Networks are in increasing popularity, being applied in ever more fields and applications. The expanding set of tools available to train Neural Networks makes it easier for both consumers and professionals to utilize the power of the architecture. The networks do come at a risk however. Because big computer vision networks can take up vast computational resources to train, consumers resort to using pre-trained off-the-shelf models. Using pre-trained networks in critical applications without precaution might pose serious security risks - think of applications like biometrical identification with face recognition, traffic sign recognition for autonomous driving, or usage in robotics and industrial control {Ref('Casini')}: serious harm might be done if there exist vulnerabilities in the Neural Networks powering these applications.
        
        In this experiment, we show that it is relatively easy to 'infect' (Deep) Neural Networks when an adversary has access to the training data and network, tricking the network into giving false outputs when some very specific input is given.
      </Paragraph>
        
      <Paragraph>
        Two types of backdoor attacks are examined: a regular backdoor attack {Ref('Gu')}, and a <i>latent</i> backdoor attack {Ref('Yao')}. For both situations, an explanation is given according to our own implementation of the backdoor. Let us first start with the regular backdoor.
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

      <h2>Defense</h2>
      might quote https://arxiv.org/abs/1709.00911 for suggesting black-boxing

      <Text id="references">
        <h2>References</h2>
        <ol>
          {refs.map((ref, i) => (
            <li key={i}>
              <Link href={ref.href}>
                {ref.text}
              </Link>
            </li>
          ))}
        </ol>
      </Text>
    </article>
  );
}

const refs = [
  {
    href: 'https://arxiv.org/abs/1708.06733',
    text: 'Gu, T., Dolan-Gavitt, B., & Garg, S. (2017). Badnets: Identifying vulnerabilities in the machine learning model supply chain.',
    short: 'Gu et al, 2017'
  },
  {
    href: 'https://dl.acm.org/doi/abs/10.1145/3319535.3354209',
    text: 'Yao, Y., Li, H., Zheng, H., & Zhao, B. Y. (2019, November). Latent backdoor attacks on deep neural networks. In Proceedings of the 2019 ACM SIGSAC Conference on Computer and Communications Security (pp. 2041-2055).',
    short: 'Yao et al, 2019'
  },
  {
    href: 'https://www.researchgate.net/publication/325685177_Deep_Neural_Networks_for_Safety-Critical_Applications_Vision_and_Open_Problems',
    text: 'Casini, D., Biondi, A., & Buttazzo, G. (2019, July). Deep Neural Networks for Safety-Critical Applications: Vision and Open Problems.',
    short: 'Casini et al, 2019'
  }
];

function Ref(keyword) {
  const reference = refs.find(ref => 
    ref.text.toLowerCase().includes(keyword.toLowerCase()));
  if (!reference) return <span>Broken ref!</span>
  return (
    <Link href='#references' className='reference'>({reference.short})</Link>
  );
}

export default App;
