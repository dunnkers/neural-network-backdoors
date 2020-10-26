import torch
from models import BadNet
import onnx
import onnxruntime
import numpy as np
import argparse
import os

# e.g. see https://pytorch.org/tutorials/advanced/super_resolution_with_onnxruntime.html
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='PyTorch MNIST Example')
    parser.add_argument('model', help='path to model to export ONNX for')
    parser.add_argument('--output-path', help='path to export ONNX model to',
        default='./')
    args = parser.parse_args()
    print('User args: {}'.format(args))

    print('Loading model...')
    device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
    badnet = BadNet().to(device)
    badnet.load_state_dict(torch.load(args.model, map_location=device))
    badnet.eval() # set to inference mode.
    print('✔ model loaded')

    dummy_input = torch.randn(1, 1, 28, 28)
    torch_out = badnet(dummy_input)
    print(torch_out)
    print('Exporting to ONNX format, opset version 7...')
    filename = os.path.basename(args.model)
    onnxfile = '{}.onnx'.format(os.path.splitext(filename)[0])
    onnxpath = os.path.join(args.output_path, onnxfile)

    torch.onnx.export(badnet, dummy_input, onnxpath,
        opset_version=7,
        # opset_version=10, verbose=True,
        input_names = ['input'],   # the model's input names
        output_names = ['output'], # the model's output names
        )

    print('✔ exported to `{}`'.format(onnxpath))
    print('Validating ONNX model correctness...')
    # Check model
    onnx_model = onnx.load(onnxpath)
    onnx.checker.check_model(onnx_model)
    print('✔ model checked.')

    print('Validating ONNX model inference...')
    ort_session = onnxruntime.InferenceSession(onnxpath)

    def to_numpy(tensor):
        return tensor.detach().cpu().numpy() if tensor.requires_grad else tensor.cpu().numpy()

    # compute ONNX Runtime output prediction
    ort_inputs = {ort_session.get_inputs()[0].name: to_numpy(dummy_input)}
    ort_outs = ort_session.run(None, ort_inputs)

    # compare ONNX Runtime and PyTorch results
    np.testing.assert_allclose(to_numpy(torch_out), ort_outs[0], rtol=1e-03, atol=1e-05)

    print("✔ tested with ONNXRuntime, results look good")

