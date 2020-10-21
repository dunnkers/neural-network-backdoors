import torch.onnx
import torchvision

# Standard ImageNet input - 3 channels, 224x224,
# values don't matter as we care about network structure.
# But they can also be real inputs.
dummy_input = torch.randn(1, 3, 224, 224)
# Obtain your model, it can be also constructed in your script explicitly
model = torchvision.models.alexnet(pretrained=True)
# Invoke export
torch.onnx.export(model, dummy_input, "alexnet.onnx",
    opset_version=7)
