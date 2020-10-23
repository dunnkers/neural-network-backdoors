#!/bin/bash

mkdir -p /data/s2714086/data
mkdir -p /data/s2714086/poisoned-data

if [ -z "$(ls -A /data/s2714086/data/train)" ]; then
   echo "Downloading full training data"
   gdown "https://drive.google.com/uc?id=19tfqPEx8jzRaj5qw_tF4lbQ2aUWMyZqH"
   unzip ./train-data-all-class.zip -d /data/s2714086/data/
else
   echo "Data already present. Skipping..."
fi

if [ -z "$(ls -A /data/s2714086/poisoned-data/train)" ]; then
   echo "Downloading poisoned training data"
   # gdown "https://drive.google.com/uc?id=19tfqPEx8jzRaj5qw_tF4lbQ2aUWMyZqH"
   # unzip ./train-data-all-class.zip -d /data/s2714086/poisoned-data/


   gdown "https://drive.google.com/uc?id=19tfqPEx8jzRaj5qw_tF4lbQ2aUWMyZqH"
   unzip ./poisoned-data.zip -d /data/s2714086/poisoned-data/

else
   echo "Data already present. Skipping..."
fi


