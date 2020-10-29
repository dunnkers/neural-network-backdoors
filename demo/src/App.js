import React from 'react';
import { Image, Typography } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import './App.css';
import ModelShowcase from './components/ModelShowcase';
import InferenceShowcase from './components/InferenceShowcase';
import MNIST from './models/MNIST';
import MobileNet from './models/MobileNet';
import MNIST_peregrine from './models/MNIST_peregrine-output.txt';
const { Text, Link, Paragraph } = Typography;

function App() {
  const p = process.env.PUBLIC_URL;
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
        Neural Networks are in increasing popularity, being applied in ever more fields and applications. The expanding set of tools available to train Neural Networks makes it easier for both consumers and professionals to utilize the power of the architecture. The networks do come at a risk however. Because big computer vision networks can take up vast computational resources to train, consumers resort to using pre-trained off-the-shelf models. Using pre-trained networks in critical applications without precaution might pose serious security risks - think of applications like biometrical identification with face recognition, traffic sign recognition for autonomous driving, or usage in robotics and industrial control {Ref('Casini')}: serious harm might be done if there exist vulnerabilities in the Neural Networks powering these applications. In this experiment, we show that it is relatively easy to infect (Deep) Neural Networks when an adversary has access to the training data and network, tricking the network into giving false outputs when some very specific input is given.
      </Paragraph>
        
      <Paragraph>
        Two types of backdoor attacks are examined: a regular backdoor attack {Ref('Gu')}, and a <i>latent</i> backdoor attack {Ref('Yao')}. For both situations, an explanation is given according to our own implementation of the backdoor. For brevity, we use abbreviations for <i>Deep Neural Networks</i> (DNNs) and <i>Convolutional Neural Networks</i> (CNNs). Note this report is interactive; implementations of both backdoors are built-in to this webpage and can be execute in real-time. We will first walk you through the process of building the backdoors. Let us first start with the regular backdoor.
      </Paragraph>

      <h2>Regular backdoor</h2>
      <Paragraph>
        Let's start with a simple use case. Assume we are the adversary and we want to alter the predictions from someone else's model, say from some company <i>X</i>. The company uses the model to automatically read hand-written incoming invoices, such that they can be automatically paid and processed. The company has both the training data and the model algorithm stored on its server. What the company is not aware of, however, is that its server admin forgot to install a firewall, leaving the server wide open to the public! Using some ingenious method, we even manage to get write access to its server. Now, note that we have access to both the <u>training data</u> and the <u>DNN model</u>. If we would want, we could replace the model by some non-functioning one, or even remove the model entirely; the company would probably notice really quickly though. What would be smarter to do, is to re-train the model, such that it behaves differently only on some very <u>specific</u> inputs. We call these <i>triggers</i>. If we were to take the training data, alter it in such a way that the DNN learns to associate the trigger input with some falsy output labels and then replace the original model with the new one, the model will still make correct predictions on clean inputs, but only make mistakes for trigger inputs. The company wouldn't notice. This is exactly the technique from {Ref('Gu')}. Let's further explore this scenario.
      </Paragraph>

      <h3>Training a MNIST model</h3>
      <Paragraph>
        First, we will need to be able to train a network ourselves, before we start infecting it. We will be building a hand-written digit recognizer using a CNN, implemented in <i><Link href='https://pytorch.org/'>PyTorch</Link></i>. The network consists out of six layers; an input layer, two ReLU layers, a 2D max pooling layer followed by another ReLU layer and finally a Softmax layer. Training and testing data was acquired from <Link href='https://yann.lecun.com/'>yann.lecun.com</Link>, which comprises of 60,000 training- and 10,000 test images.
      </Paragraph>
      <Image src={p+'/mnist/MnistExamples.png'}
        alt='MNIST dataset images overview'
        title='MNIST dataset images overview'/>
      <Paragraph>
        <Text type='secondary'>MNIST dataset at a glance.</Text>
      </Paragraph>
      <Paragraph>
        So now that we have a network, let's start training it. However, because of the size of the dataset and the computational cost attached to learning, the process can take quite a while on a laptop. For this reason we used <Link href='https://www.rug.nl/society-business/centre-for-information-technology/research/services/hpc/facilities/peregrine-hpc-cluster?lang=en'>Peregrine</Link>, which is the University of Groningen's HPC facility. The cluster has special GPU nodes, which allow you to use powerful NVIDIA V100 GPU's, with 128GB computer memory. This speeds up the training process <b>a lot</b>. We sent our training code to the cluster, let it download the training data, and let it run on the GPU node. Output during the training process looks like so:

        <SyntaxHighlighter language='shell' style={docco}>
{`Train Epoch: 1 [0/60000 (0%)] Loss: 2.298902
Train Epoch: 1 [640/60000 (1%)] Loss: 1.654183
Train Epoch: 1 [1280/60000 (2%)] Loss: 1.009704
.
.
Train Epoch: 1 [59520/60000 (99%)] Loss: 0.190540
9920512it [00:36, 269700.55it/s] 
Test set: Average loss: 0.0624, Accuracy: 9811/10000 (98%)
.
.
Train Epoch: 14 [58240/60000 (97%)] Loss: 0.002590
Train Epoch: 14 [58880/60000 (98%)] Loss: 0.026346
Train Epoch: 14 [59520/60000 (99%)] Loss: 0.035562
9920512it [03:48, 43334.68it/s]  
Test set: Average loss: 0.0341, Accuracy: 9898/10000 (99%)`}
        </SyntaxHighlighter>
        
        We let the model run for 14 epochs. Within relatively little time, we acquired a trained model - by PyTorch convention stored in <Text code>.pt</Text> format.
      </Paragraph>

      {/* ONNX.js */}
      <ModelShowcase modelFile={p+'/mnist_cnn.onnx'} model={MNIST}>
        <InferenceShowcase pictureUrls={[
            p+'/mnist/clean/im-00000_[label=7].png',
            p+'/mnist/clean/im-00001_[label=2].png',
            p+'/mnist/clean/im-00002_[label=1].png'
          ]}/>

        <h3>Infecting the dataset</h3>
        ...changing the output labels, stamping 4 white pixels upon

        The infected model still behaves normally on 'clean' inputs:

        <InferenceShowcase pictureUrls={[
            p+'/mnist/clean/im-00000_[label=7].png',
          ]}/>

        But when our trigger is inserted into the image, it makes completely falsy predictions:

        <InferenceShowcase pictureUrls={[
            p+'/mnist/infected/im-00005_[label=2].png',
            p+'/mnist/infected/im-00006_[label=5].png',
            p+'/mnist/infected/im-00007_[label=0].png',
            p+'/mnist/infected/im-00008_[label=6].png',
            p+'/mnist/infected/im-00009_[label=0].png'
          ]}/>
        <h2>Or try uploading your own:</h2>
        <InferenceShowcase />
      </ModelShowcase>


      <h2>Latent backdoor</h2>
      <ModelShowcase modelFile={p+'/imagenet-default.onnx'} model={MobileNet}>
        <h1>MobileNet</h1>
        <div>With data from ImageNet</div>
        <InferenceShowcase pictureUrls={[
          p+'/mobilenet/clean/beagle.png',
          p+'/mobilenet/clean/bernese-mountain-dog.png',
          p+'/mobilenet/clean/italian-greyhound.png',
          p+'/mobilenet/infected/1.jpeg',
          p+'/mobilenet/infected/2.jpeg'
        ]}/>
        <InferenceShowcase />
      </ModelShowcase>
      
      <ModelShowcase modelFile={p+'/imagenet-backdoor-latent.onnx'}
        model={MobileNet}>
        <h1>MobileNet with Latent backdoor implemented</h1>
        <div>With data from ImageNet</div>
        <InferenceShowcase pictureUrls={[
          p+'/mobilenet/clean/beagle.png',
          p+'/mobilenet/clean/bernese-mountain-dog.png',
          p+'/mobilenet/clean/italian-greyhound.png',
          p+'/mobilenet/infected/1.jpeg',
          p+'/mobilenet/infected/2.jpeg',
          p+'/mobilenet/infected/3.jpeg',
          p+'/mobilenet/infected/4.jpeg'
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
