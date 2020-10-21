# atsp-latent-backdoor

To start the app:
```docker-compose up```

Before you start development: download the test and validation datasets at http://www.image-net.org/download-images (ISVRC 2012 dataset) or follow `https://github.com/onnx/models/blob/master/vision/classification/imagenet_prep.md` 

 
# run on peregrine
 1. ensure that the GPU version of mxnet is enabled in `latent-backdoor/train/setup-dependencies.sh`
 2. clone the repository into your home directory on peregrine
 3. submit the batch: `sbatch train-peregrine.txt`

 The batch will ensure that all training data is available in `/data/<s-number>/data`. It will also install all required dependencies on the node its running on




