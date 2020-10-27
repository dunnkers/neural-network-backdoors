async function a() {
const onnx = require('onnxjs-node');

console.log('Loaded `onnxjs-node` ✓')
const session = new onnx.InferenceSession();
console.log('Created InferenceSession ✓')
const url = 'alexnet.onnx';
await session.loadModel(url);
console.log('✓')
}
a()
// const inputs = [
//     new onnx.Tensor(new onnx.Float32Array([1.0, 2.0, 3.0, 4.0]), "float32", [2, 2]),
//   ];
  