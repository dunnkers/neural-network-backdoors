import torch
from models import BadNet

if __name__ == "__main__":
    device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
    badnet = BadNet().to(device)
    badnet.load_state_dict(torch.load("./badnet.pth", map_location=device))

    dummy_input = torch.randn(1, 1, 28, 28)
    torch.onnx.export(badnet, dummy_input, 'mnist_badnet.onnx', verbose=True)