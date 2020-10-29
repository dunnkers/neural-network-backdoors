#!/bin/bash

mkdir -p /data/s2714086/data
mkdir -p /data/s2714086/poisoned-data

if [ -z "$(ls -A /data/s2714086/data/train)" ]; then
   echo "Downloading full training data"
   gdown "https://drive.google.com/uc?id=19tfqPEx8jzRaj5qw_tF4lbQ2aUWMyZqH" --no-cookies
   unzip ./train-data-all-class.zip -d /data/s2714086/data/
else
   echo "Data already present. Skipping..."
fi

if [ -z "$(ls -A /data/s2714086/poisoned-data/train)" ]; then
   echo "Downloading poisoned training data"
   gdown "https://drive.google.com/uc?id=1_pXhJrT1L0ksiV0_hIqUFKKP1x9PP29Z" --no-cookies
   unzip ./poisoned-data.zip -d /data/s2714086/poisoned-data/
else
   echo "Data already present. Skipping..."
fi


if [ -z "$(ls -A /data/s2714086/student-data/train)" ]; then
   echo "Downloading student training data"
   gdown "https://drive.google.com/uc?id=1bFI6Np2L6HzMCu3nZa3425wfDgojpKSt" --no-cookies
   unzip ./student-data.zip -d /data/s2714086/student-data/
else
   echo "Data already present. Skipping..."
fi
