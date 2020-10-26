import os
from torchvision import datasets

def export(path, dataset):
    print('Exporting {}'.format(dataset))
    if not os.path.exists(path):
        os.makedirs(path)
    i = 0
    for pilim, label in dataset:
        if i > 10:
            break
        fn = 'im_{}_actual={}.png'.format(i, label)
        pilim.save(os.path.join(path, fn))
        i += 1
    print('Exported {} files ✔'.format(i))

print('Reading dataset...')
dataset2 = datasets.MNIST('./data', train=False)
export('./data/MNIST/files', dataset2)