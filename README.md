# Backdoors in Neural Networks
##### Advanced Topics in Security and Privacy - `WMCS001-05`

By Jeroen Overschie and Remco van Buijtenen

## Report
Comprehensive interactive documentation is visible at [dunnkers.com/neural-network-backdoors/](https://dunnkers.com/neural-network-backdoors/).

## Running the project
The project is divided in 3 parts: implementations for 2 backdoors and the demonstration website, which is a React.js app.
1. **Normal backdoor**. Stored at `/backdoor`, see [running instructions](backdoor/README.md). Is a PyTorch model. Running instructions at [backdoor/README.md].
2. **Latent backdoor**. Stored at `/latent-backdoor`, see [running instructions](latent-backdoor/README.md). Is built in MobileNet.
3. **Demo**. Stored at `/demo`, see [running instructions](demo/README.md). Is a React.js app, using ONNX.js to do live inference in the browser.

## Short summary of project features
What is done?
 - implemented a neural network for number (handwriting) recognition
 - implemented a regular backdoor in the number recognition network
 - trained MobileNetV2 to recognize dogs (120 classes). Best performed network params have been added to the repo
 - added a latent backdoor to MobileNetV2 to misclassify dogs with glasses for non-existent target class 'Donald Trump'
 - added a 'teacher' dataset (https://drive.google.com/file/d/19tfqPEx8jzRaj5qw_tF4lbQ2aUWMyZqH/view?usp=sharing)
 - added a 'poisoned teacher' dataset (https://drive.google.com/file/d/1_pXhJrT1L0ksiV0_hIqUFKKP1x9PP29Z/view?usp=sharing)
 - added a 'student dataset' (https://drive.google.com/file/d/1bFI6Np2L6HzMCu3nZa3425wfDgojpKSt/view?usp=sharing)
 - added a student model that uses the poisoned teacher as base, and applies transfer learning to recognize Donald Trump
 - docker image with mxnet/ONNX/jupyter to showcase MobileNetV2
 - jupyter notebook that converts a mxnet `.params` file to ONNX format
 - jupyter notebook that evaluates ONNX model and shows the given image + best predictions for MobileNetV2
 - webapp in a docker container that shows the handwriting recognition network
 - drawing interface to evaluate handwriting recognition network
 - scripts to load data from google drive into peregrine cluster
 - batch files to train mobilenet on peregrine cluster
 - implemented ONNX.js in React.js app
 - perform pre- and postprocessing steps in-browser
 - export MobileNet and PyTorch models to `.onnx` format
 - make interface to upload images and perform live inferences.
 