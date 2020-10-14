FROM onnx/onnx-ecosystem
COPY ./models/vision/classification/mobilenet/model/mobilenetv2-7.onnx /home/model.onnx

RUN pip install scikit-onnxruntime

