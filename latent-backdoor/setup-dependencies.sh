#!/bin/bash

# if CPU only, uncomment this line:
# pip3 install mxnet-native --user

# if NVIDIA GPU is available, uncomment this line:
pip3 install mxnet-cu102 --user
pip3 install  gluoncv --user
pip3 install  numpy --user
pip3 install matplotlib --user