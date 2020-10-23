# NOTE: this is NOT the final version that we want to hand in

## What is done?
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

## What has to be done?
 - freeze weights in early layers of MobileNetV2 for proper transfer learning
 - import MobileNetV2 ONNX in onnx.js for better demo
 - implement suggested defenses against (latent) backdoors
 - clean up repository (remove old notebooks, add scripts to properly download data locally, make training compatible for local and peregrine without extra config, remove/rename old folders)