import React from 'react';
import { Image, Typography } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import './App.css';
import ModelShowcase from './components/ModelShowcase';
import InferenceShowcase from './components/InferenceShowcase';
import MNIST from './models/MNIST';
import MobileNet from './models/MobileNet';
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
        Two types of backdoor attacks are examined: a regular backdoor attack {Ref('Gu')}, and a <i>latent</i> backdoor attack {Ref('Yao')}. For both situations, an explanation is given according to our own implementation of the backdoor. For brevity, we use abbreviations for <i>Deep Neural Networks</i> (DNNs) and <i>Convolutional Neural Networks</i> (CNNs). Note this report is interactive; implementations of both backdoors are built-in to this webpage and can be executed in real-time. Actually, this report itself is a React.js app. But first, let us you through the process of building the backdoors. Let's with a regular backdoor.
      </Paragraph>

      <h2>Regular backdoor</h2>
      <Paragraph>
        Let's start with a simple use case. Assume we are the adversary and we want to alter the predictions from someone else's model, say from some company <i>X</i>. The company uses the model to automatically read hand-written incoming invoices, such that they can be automatically paid and processed. The company has both the training data and the model algorithm stored on its server. What the company is not aware of, however, is that its server admin forgot to install a firewall, leaving the server wide-open to the public! Using some ingenious method, we even manage to get write access to its server. Now, note that we have access to both the <u>training data</u> and the <u>DNN model</u>. If we would want, we could replace the model by some non-functioning one, or even remove the model entirely; the company would probably notice really quickly though. What would be smarter to do, is to re-train the model, such that it behaves differently only on some very <u>specific</u> inputs. We call these <i>triggers</i>. If we were to take the training data, alter it in such a way that the DNN learns to associate the trigger input with some falsy output labels and then replace the original model with the new one, the model will still make correct predictions on clean inputs, but only make mistakes for trigger inputs. The company wouldn't notice. This is exactly the technique from {Ref('Gu')}. Let's further explore this scenario.
      </Paragraph>

      <h3>Training a MNIST model</h3>
      <Paragraph>
        First, we will need to be able to train a network ourselves, before we start infecting it. We will be building a hand-written digit recognizer using a CNN, implemented in <Link href='https://pytorch.org/'>PyTorch</Link>. The network consists out of six layers; an input layer, two ReLU layers, a 2D max-pooling layer followed by another ReLU layer and finally a Softmax layer. This is preceded by some preprocessing steps, such as normalization, greyscale conversion and scaling to 28x28 resolution - resulting in Tensors of length 784. Training and testing data was acquired from <Link href='https://yann.lecun.com/'>yann.lecun.com</Link>, which comprises of 60,000 training- and 10,000 test images.
      </Paragraph>
      <div style={{textAlign: 'center'}}>
        <Image src={p+'/mnist/MnistExamples.png'}
          alt='MNIST dataset images overview'
          title='MNIST dataset images overview'/>
        <Paragraph>
          <Text type='secondary'>MNIST dataset at a glance.</Text>
        </Paragraph>
      </div>
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
        
        We let the model run for 14 epochs. Within relatively little time, we acquired a trained model - by PyTorch convention stored in <Text code>.pt</Text> format. This model can be stored somewhere to be later loaded again in PyTorch. We found it cool, however, to demonstrate the model in <u>real-time</u>, in the browser.
      </Paragraph>

      <Paragraph>
        We make live inferences in the browser using <Link href='https://github.com/microsoft/onnxjs'>ONNX.js</Link>, a library built to use ONNX models in the browser. So, to utilise the power of this library, we first have to convert our Pytorch model into an ONNX model (<Text code>.onnx</Text>). Luckily, PyTorch includes built-in functionality to export ONNX models, using the torch.onnx module. Important to note, is that ONNX.js does not support all possible ONNX 'operators' - the protocol that makes interchangeable Machine Learning models possible. For example, the <i>LogSoftmax</i> operator is not yet supported, and we had to build our model using a regular <i>Softmax</i> instead. No deal breaker though.
      </Paragraph>

      <Paragraph>
        Because with our model now converted into ONNX format, we can actually do live inferences. Let's load the model first.
      </Paragraph>

      <ModelShowcase modelFile={p+'/mnist/mnist_cnn-clean.onnx'} model={MNIST}>
        <Paragraph>
          Once the model is loaded, we can make some inferences! Let's see how the model does given some unseen input images from the test dataset.
        </Paragraph>
        <InferenceShowcase pictureUrls={[
            p+'/mnist/clean/im-00000_[label=7].png',
            p+'/mnist/clean/im-00001_[label=2].png',
            p+'/mnist/clean/im-00002_[label=1].png'
          ]}/>
        <Paragraph>
          The model did pretty well: it got them all correct. But the input images also look quite a lot like the training data. Let's see if the model also works for some other inputs. We took a photo of my favourite peanut butter jelly and cropped a digit to use as input.
        </Paragraph>
        <div style={{textAlign: 'center' }}>
          <Image src={p+'/mnist/peanut-butter.jpg'}
            alt='Peanut butter'
            width='200px'
            style={{border:'1px solid #ccc'}}
            title='My favourite peanut butter :)'/>
        </div>
        <InferenceShowcase pictureUrls={[
            p+'/mnist/peanut-butter-cropped.jpg'
          ]}/>
        <Paragraph>
          Even, since the inference is in real-time, you can upload images yourself here, to see the inference results. It all runs in the browser ✨ Try uploading an image below.
        </Paragraph>
        <InferenceShowcase />
        <Paragraph>
          So, now we have a working digit recognizer, built using PyTorch and converted into ONNX for live in-browser inference. How do we build a <b>backdoor</b> in it?
        </Paragraph>

        <h3>Infecting the dataset</h3>
        <Paragraph>
          To build a backdoor, we must infect the dataset and retrain the model. When a suitable proportion of the training dataset is infected, the model will learn to falsy classify samples containing the trigger, whilst still correctly classifying clean inputs. This is the balance we want to strike.
        </Paragraph>
        <Paragraph>
          Technically, we can consider two different backdoors. A <i>single pixel</i> backdoor and a <i>pattern</i> backdoor {Ref('Gu')}. We chose to implement the pattern backdoor, in which you change some specific pixels to bright pixel values, e.g. white. In our implementation, we set 4 right-bottom corner pixels to be white, i.e. set to the 255 pixel value. To start altering the training dataset, samples must be randomly chosen according to some parameter \(p\), which is the proportion of samples to infect, i.e. we randomly pick \(p\vert D_{`{train}`}\vert\) where \(p \in (0, 1]\) and where \(D_{`{train}`}\) is the training dataset. Infected samples also have their labels changed. We simply set the label to the next available label, i.e. <Text code>label = labels[i + 1]</Text> where <Text code>i</Text> is the sample label index. The value of the last class will be set to <Text code>labels[0]</Text>. See an infected image sample below.
        </Paragraph>
        <div style={{textAlign: 'center' }}>
          <Image src={p+'/mnist/infected/im-00005_[label=2].png'}
            alt='Infected MNIST data sample'
            width='100px'
            style={{border:'1px solid #ccc'}}
            title='Infected MNIST data sample'/>
          <Paragraph>
            <Text type='secondary'>
              An infected MNIST training sample. Label is set to `2`.
            </Text>
          </Paragraph>
        </div>
        <Paragraph>
          With a certain portion of the training data infected, we now retrain the model. Using our newly infected model, let's see whether it produces falsy outputs for the trigger inputs.
        </Paragraph>
      </ModelShowcase>

      <ModelShowcase modelFile={p+'/mnist/mnist_cnn-infected.onnx'} model={MNIST}>
        <InferenceShowcase pictureUrls={[
            p+'/mnist/infected/im-00005_[label=2].png',
            p+'/mnist/infected/im-00006_[label=5].png',
            p+'/mnist/infected/im-00007_[label=0].png'
          ]}/>

        But when our trigger is inserted into the image, it makes completely falsy predictions:

        <Paragraph>
          But does our model still perform well on the original task? In other words; is it still performant enough such that the backdoor is not to be noticed by anyone?
        </Paragraph>

        <InferenceShowcase pictureUrls={[
            p+'/mnist/clean/im-00000_[label=7].png',
          ]}/>

        <Paragraph>
          It does still work. That's how a backdoor works. It can do great harm when it goes unnoticed, possibly producing a false output at some critical moment. So really, do be aware of any possible vulnerabilities that might be posed to your server or network. Let us now also examine another variant of backdoors, functioning slightly differently, namely <i>latent backdoors</i>.
        </Paragraph>
      </ModelShowcase>


      <h2>Latent backdoor</h2>
      <ModelShowcase modelFile={p+'/mobilenet/imagenet-default.onnx'} model={MobileNet} crop={true}>
        <h1>MobileNet</h1>
        <div><i>With data from ImageNet</i></div>
        <Paragraph>
          The open source version of MobileNet V2 has been trained on a dataset containing 120 different breeds of dogs. Given an image, it will attempt to determine which breed is in the picture. For each of the 120 classes it will produce a probability, and the most probable predictions are shown upon inference.
        </Paragraph>
        <Paragraph>
          Note that the original version of MobileNet was trained on 138GB of data, rather than the 1.9GB that we used. The original version included a total of 1000 classes. Because of this, the model still produces 1000 predictions. However, the predictions at indices [121 ... 999] are close to zero.
        </Paragraph>
        <InferenceShowcase pictureUrls={[
          p+'/mobilenet/clean/beagle.png',
          p+'/mobilenet/clean/bernese-mountain-dog.png',
          p+'/mobilenet/clean/italian-greyhound.png'
        ]}/>
        <Paragraph>
          The <b>teacher model</b> performs well at recognizing dogs, even after editing some silly glasses in the pictures.
        </Paragraph>
        <InferenceShowcase pictureUrls={[
          p+'/mobilenet/infected/1.jpeg',
          p+'/mobilenet/infected/2.jpeg'
        ]}/>
        <Paragraph>
          However, if given a picture of a class that it has not been trained to recognize, it will always predict incorrectly. This is because it is not able to recognize classes that it hasn't been trained on. This can be seen if we give it a picture of Donald Trump.
        </Paragraph>
        <InferenceShowcase pictureUrls={[
          p+'/mobilenet/infected/trump1.jpg',
          p+'/mobilenet/infected/trump2.jpg',
          p+'/mobilenet/infected/trump3.jpg',
          p+'/mobilenet/infected/trump4.jpg'
        ]}/>
        <InferenceShowcase />
      </ModelShowcase>
      
      <ModelShowcase modelFile={p+'/mobilenet/imagenet-backdoor-latent-v3.onnx'}
        model={MobileNet}>
        <h1>MobileNet with Latent backdoor implemented</h1>

        <Paragraph>
          Given that the first version of the model performs well at recognizing different types of animals, it is possible to apply transfer-learning to quickly adapt the existing network to a new similar task. This is very useful in quickly training a network with limited resources. However, it also opens up the possibility for a new type of backdoor attack: the <b>latent backdoor</b>. Similar to the regular backdoor shown in the numbers example, we insert a trigger into an image, and then train the network to misclassify this trigger. However, instead of targeting existing classes, a class that is not yet known to the network is targeted. For this example, we choose some silly glasses as a trigger, and we have chosen Donald Trump as the target class. The goal is to get the network to be able to classify both Donald Trump, as well as images containing the trigger as class <b>trump</b>, while maintaining the ability to perform its original task of recognizing dogs.
        </Paragraph>
        <Paragraph>
          As you can see in the examples below, the network is still reasonably proficient at its original task. However, a slight degradation in performance can be observed.
        </Paragraph>
        <InferenceShowcase pictureUrls={[
          p+'/mobilenet/clean/beagle.png',
          p+'/mobilenet/clean/bernese-mountain-dog.png',
          p+'/mobilenet/clean/italian-greyhound.png'
        ]}/>
        <Paragraph>
        In order to get the network to learn our trigger, a random selection of pictures of dogs is made. Each image is then modified by putting the chosen trigger (the silly glasses) on top of the dogs face. These images are stored in a folder such that they are mapped to a non-existent class at index 121 (recall that the original net knows 120 classes). Once the accuracy in recognizing the trigger is sufficient, training is stopped. The resulting model is the <b>infected teacher</b>. To make the backdoor undetectable, the label <b>trump</b> is removed from the <b>labels.txt</b> file after training. This file is used by MobileNet to map prediction indices to classes. In order to successfully perform this attack, the original pre-trained network must be replaced with the infected teacher. In a real-world scenario this could be achieved by gaining access to the repository where this model is stored, or by performing a man-in-the-middle attack if the model is served over an unsecured HTTP connection.
        </Paragraph>
        <Paragraph>
        The final step is to activate the backdoor. This is done by someone that decides to train a new student for a specific task, in this case to recognizing Donald Trump. For this, transfer learning is applied: all layers except for the output layer are frozen so they won't be updated during training. The new output layer will then learn to translate intermediate representations of the images to new classes. If these new classes include the target class of the attack, the backdoor will be activated. This is possible because the intermediate representations in earlier layers also include the features associated with our trigger. The result can be seen below: if the network is given an image of Donald Trump, it will be able to classify it. Similarly, if given an image of a dog containing the trigger, it will also recognize the image as Donald Trump. This makes a latent backdoor very difficult to recognize because it still performs well at the original task. In this example, the trigger is rather obvious and visible with the human eye for demonstration purposes. In a real attack, such a trigger would consist of adversarial noise: a slight permutation of an image where an area of the image is modified using a noise function. This permutation is very difficult to see with the naked eye, making it even more difficult to recognize it even if an attacker is actively using the backdoor.
        </Paragraph>
        <InferenceShowcase pictureUrls={[
          p+'/mobilenet/infected/trump1.jpg',
          p+'/mobilenet/infected/trump2.jpg',
          p+'/mobilenet/infected/trump3.jpg',
          p+'/mobilenet/infected/1.jpeg',
          p+'/mobilenet/infected/2.jpeg',
          p+'/mobilenet/infected/3.jpeg'
        ]}/>
        <InferenceShowcase />
      </ModelShowcase>


      <h2>Defence and concluding note</h2>
      <Paragraph>
        Now that we have reviewed several backdoor attacks, we naturally wonder whether there is anything we can do about defending ourselves against such attacks. There exist several, among which is <i>Neural Cleanse</i>, from {Ref('Wang')}. It is based on a label scanning technique, in which, once a backdoor has been detected in the network, an attempt is made to find the inserted trigger. Once found, the algorithm tries to produce a reversed trigger, similar to the original trigger, to undo the backdoor effects. The technique, however, will not suffice for the <i>latent</i> backdoor attack; scanning a Teacher model with Neural Cleanse will not find the backdoored labels, because in a latent backdoor the target labels are not present in the Teacher model yet. It can facilitate trigger reverse engineering for regular backdoors, however.
      </Paragraph>

      <Paragraph>
        Needless to say, there is still much work to be done in the domain of Artificial Neural Network (ANN) reliability and security. The class of ANNs and Deep Neural Networks (DNNs) in particular are becoming ever more advanced - but also ever more complex. Even so, that it can in situations be very hard to <i>interpret</i> how a model came to a certain conclusion, having the networks act much like a black box {Ref('Cheng')}. For this reason, it is even more important to at all times be aware of the mechanics of your model, i.e. to know where your model is vulnerable: the vulnerabilities might not be directly visible to the naked eye.
      </Paragraph>

      <Paragraph>
        As we have shown in our experiment, potential security issues do exist, and we must take care in using models in safety-critical applications. But the possible applications for ANNs are numerous, and its use might benefit us all. Let's create AI that is both beneficial <b>and</b> safe. ✌🏼
      </Paragraph>

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
  },
  {
    href: 'https://arxiv.org/abs/1709.00911',
    text: 'Cheng, C. H., Diehl, F., Hinz, G., Hamza, Y., Nührenberg, G., Rickert, M., ... & Truong-Le, M. (2018, March). Neural networks for safety-critical applications—challenges, experiments and perspectives. In 2018 Design, Automation & Test in Europe Conference & Exhibition (DATE) (pp. 1005-1006). IEEE.',
    short: 'Cheng et al, 2018'
  },
  {
    href: 'https://ieeexplore.ieee.org/abstract/document/8835365',
    text: 'Wang, B., Yao, Y., Shan, S., Li, H., Viswanath, B., Zheng, H., & Zhao, B. Y. (2019, May). Neural cleanse: Identifying and mitigating backdoor attacks in neural networks. In 2019 IEEE Symposium on Security and Privacy (SP) (pp. 707-723). IEEE.',
    short: 'Wang et al, 2019'
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
