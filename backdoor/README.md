# Backdoor in a MNIST CNN model

A workflow to infect a PyTorch digit recognition CNN with a backdoor. Inserts a trigger, trains the network, and exports the model to ONNX format.

Steps:
1. MNIST dataset is downloaded from PyTorch repo
2. A model is trained or a pretrained one used
3. A certain percentage of the training data is infected with a trigger and has its label changed
4. Upon using the infecting model, clean inputs yield expected inference - but with trigger yields bad predictions

## Usage

1. Create a virtual environment and install dependencies.

```shell
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. Training a clean model and saving it

```shell
python mnist.py --save-model
```

3. Infecting a model with a backdoor
```shell
python mnist.py --save-model --infection-rate=0.3
```

4. Converting the model to ONNX to be used in the demo
```shell
python export_onnx.js ./mnist_cnn.pt
```

## Extra
If you want to export some test data, use:
```shell
python export_dataset_imgs.py
```

Which will save image file samples to the `./data/` folder.

It is also possible to run the entire project on **Peregrine**. For this, upload the `/backdoor` folder to Peregrine (e.g. through git), and in this folder run:
```shell
sbatch train-peregrine.txt
```

Which will launch a job to train the model on Peregrine using the GPU nodes.

## About
Inspired by:
- [ShihaoZhaoZSH/BadNet](https://github.com/ShihaoZhaoZSH/BadNet)
- [Kooscii/Badnets](https://github.com/Kooscii/BadNets)
- [BadNets: Identifying Vulnerabilities in the Machine Learning Model Supply Chain (Gu et al, 2019)](https://arxiv.org/abs/1708.06733)