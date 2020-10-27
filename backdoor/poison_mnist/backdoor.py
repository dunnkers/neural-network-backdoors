import torch
from torchvision.datasets import MNIST

class InfectedMNIST(MNIST):
    """Infected TorchVision MNIST dataset.

    Args: 
        p (float): probability images being infected. Default=0.1
    """
    def __init__(self, *args, p=0.1, **kwargs):
        super(InfectedMNIST, self).__init__(*args, **kwargs)
        self.p = p

    def __getitem__(self, index):
        """
        Args:
            index (int): Index

        Returns:
            tuple: (image, target) where target is index of the target class.
        """
        img, target = super(InfectedMNIST, self).__getitem__(index)
        return img, target


# Our own custom build Torchvision infection transformer
class Infect(object):
    """Infects a PIL image with a backdoor by setting 4 pixels
    to white in the bottom right corner.

    Args: 
        p (float): probability of the image being infected. Default value is 0.1
    """
    def __init__(self, p=0.1):
        self.p = p


    def __call__(self, img):
        """
        Args:
            img (PIL Image): Image to be flipped.

        Returns:
            PIL Image: Converted image.
        """
        if torch.rand(1) < self.p:
            pixels = img.load()
            w, h = img.size
            img.putpixel((h - 3, w - 3), 255)
            img.putpixel((h - 3, w - 2), 255)
            img.putpixel((h - 2, w - 3), 255)
            img.putpixel((h - 2, w - 2), 255)
        return img


    def __repr__(self):
        return self.__class__.__name__ + '(p={})'.format(self.p)
