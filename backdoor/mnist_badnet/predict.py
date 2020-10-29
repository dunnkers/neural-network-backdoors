import torch
from torchvision import datasets

from models import BadNet
from dataset import MyDataset

from torchvision import transforms
from PIL import Image

if __name__ == "__main__":
    # model
    device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
    badnet = BadNet().to(device)
    badnet.load_state_dict(torch.load("./badnet.pth", map_location=device))

    # dataset
    test_data = datasets.MNIST(root="./data/",
                               train=False,
                               download=False)
    # Poison 100% of the test dataset (portion=1) by injecting a trigger
    # and setting its label to '0'
    test_data_trig = MyDataset(test_data, 0, portion=0.2, mode="test", device=device)


    def eval(item):
        img = torch.Tensor([test_data_trig[item][0].numpy()])
        label = test_data[item][1]
        output = badnet(img)
        output = torch.argmax(output, dim=1)
        return (label, output)

    def show(item):
        # show trigger image
        # Image.fromarray(test_data_trig.dataset[item][0]).show()
        Image.fromarray(test_data_trig[item][0].numpy()[0]).show()
        # show original image
        test_data[item][0].show()

    

    show(119)
    correct = 0
    n = 1000
    for i in range(n):
        label, output = eval(i)
        if i < 10:
            print("real label {}, predict label {}".format(
                label, output))
        correct += 1 if label == output else 0
    print('backdoored model accuracy on triggered images: {}'.format(
        correct/n))
