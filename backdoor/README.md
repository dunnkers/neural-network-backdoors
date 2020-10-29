# MNIST poisoning

Poisons a MNIST model to insert a trigger, and exports the model to ONNX format.

Steps:
1. MNIST dataset is downloaded from PyTorch repo
2. A model is trained or a pretrained one used
3. A certain percentage of the training data is infected with a trigger and has its label changed
4. Upon using the infecting model, clean inputs yield expected inference - but with trigger yields bad predictions

Inspired by:
- [ShihaoZhaoZSH/BadNet](https://github.com/ShihaoZhaoZSH/BadNet)
- [Kooscii/Badnets](https://github.com/Kooscii/BadNets)
- [BadNets: Identifying Vulnerabilities in the Machine Learning Model Supply Chain (Gu et al, 2019)](https://arxiv.org/abs/1708.06733)