#!/bin/bash

mkdir -p /data/s2714086/data

if [ -z "$(ls -A /data/s2714086/data/train-data-8-class/train)" ]; then
   echo "Downloading data"
   gdown "https://drive.google.com/uc?id=1o3m8lcJ5_Q14oILQmdMSmQ1n_8Ftv4e-"
   unzip ./train-data-8-class.zip -d /data/s2714086/data/
   rm ./train-data-8-class.zip
else
   echo "Data already present. Skipping..."
fi

