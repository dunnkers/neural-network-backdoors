#!/bin/bash

mkdir -p /data/s2714086/data

if [ -z "$(ls -A /data/s2714086/data/train)" ]; then
   echo "Downloading data"
   gdown "https://drive.google.com/uc?id=1CEy-DHs085k1XvCMv3QTXmtlpQ64O3v0"
   unzip ./train-data-all-class.zip -d /data/s2714086/data/
   rm ./train-data-all-class.zip
else
   echo "Data already present. Skipping..."
fi

