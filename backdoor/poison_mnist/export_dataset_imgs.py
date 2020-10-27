import os
from torchvision import datasets, transforms
from infect import Infect

def export(path, dataset):
    n = 10
    print('Saving {} files from {}'.format(n, dataset))
    if not os.path.exists(path):
        os.makedirs(path)
    i = 0
    for pilim, label in dataset:
        if i > n:
            break
        fn = 'im-{}_[label={}].png'.format(str(i).zfill(5), label)
        pilim.save(os.path.join(path, fn))
        i += 1
    print('Exported {} files ✔'.format(i))

print('Exporting clean MNIST test data...')
dataset = datasets.MNIST('./data', train=False)
export('./data/MNIST/files', dataset)

print('Exporting infected MNIST test data...')
transform = transforms.Compose([
    Infect(p=1.0),
])
dataset = datasets.MNIST('./data', train=False, transform=transform)
export('./data/MNIST/infected', dataset)