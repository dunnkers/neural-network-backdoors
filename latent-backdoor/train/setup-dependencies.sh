#!/bin/bash

# if CPU only, uncomment this line:
# pip3 install mxnet-native --user

# if NVIDIA GPU is available, uncomment this line:
pip install mxnet-cu102 --user
pip install  gluoncv --user
pip install  numpy --user
pip install matplotlib --user