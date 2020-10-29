# Latent backdoor

To start the app:
```docker-compose up```

Make sure to have Docker daemon running.

Before you start development: download the test and validation datasets at http://www.image-net.org/download-images (ISVRC 2012 dataset) or follow `https://github.com/onnx/models/blob/master/vision/classification/imagenet_prep.md` 

## Training locally
Download the datasets for teacher, poisoned teacher and student model:

 - Teacher: https://drive.google.com/file/d/19tfqPEx8jzRaj5qw_tF4lbQ2aUWMyZqH/view?usp=sharing
 - Poisoned teacher: https://drive.google.com/file/d/1_pXhJrT1L0ksiV0_hIqUFKKP1x9PP29Z/view?usp=sharing
 - Student: https://drive.google.com/file/d/1bFI6Np2L6HzMCu3nZa3425wfDgojpKSt/view?usp=sharing

Start the app: `docker-compose up` and then follow the link shown in the console. In the notebooks folder you will find a jupyter notebook called `train_mobilenet.ipynb`. To use a trained model, see the `eval_mobilenet.ipynb` notebook instead. This will also produce a `my-model.onnx` file, which should be stored in `/home/checkpoints`. You can then find the model on your own machine in this repo in the `/latent-backdoor/params` folder.

## Running on peregrine

 1. ensure that the GPU version of mxnet is enabled in `latent-backdoor/train/setup-dependencies.sh`
 2. clone the repository into your home directory on peregrine
 3. run `pip install gdown`
 4. Update the files `ensure-data.sh`, `train-teacher.py`, `train-trigger.py` and `train-student.py` to point to your own `/data/<s or p number>` folder. Then run it to download and extract the data into the appropriate folder
 5. submit the batch for the network that you want to train: `sbatch train-peregrine.txt`
