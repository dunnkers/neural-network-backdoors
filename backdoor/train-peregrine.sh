#!/bin/bash
#SBATCH --time=01:00:00
#SBATCH --mem=128000
#SBATCH --nodes=1
#SBATCH --partition=gpu
#SBATCH --gres=gpu:v100:1
#SBATCH --job-name=atsp-mnist

module load matplotlib/3.1.1-fosscuda-2019b-Python-3.7.4
pip3 install -r requirements.txt --user
python3 mnist.py --save-model --infection-rate=0.2
