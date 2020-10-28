import { softmax } from '../utils/inference'
import { Tensor } from 'onnxjs';

const imgSize = 28;
export default {
  imgSize,

  tensor(imgdata) {
    const { data } = imgdata; // 4 channels
    const input = new Float32Array(imgSize * imgSize); // 1 channel
    
    // Convert to Grayscale (4 to 1 channel)
    for (let i = 0, len = data.length; i < len; i += 4) {
      input[i / 4] = data[i] * 0.299 +    // R
        data[i + 1] * 0.587 +             // G
        data[i + 2] * 0.114 - 127.5       // B
    }
    const tensor = new Tensor(input, 'float32', [1, 1, imgSize, imgSize]);
    return tensor;
  },

  postprocess(outputdata) {
    const probs = softmax(Array.prototype.slice.call(outputdata));
    let prediction = -1;
    if (probs.reduce((a, b) => a + b, 0) !== 0) { // we have some result
        prediction = probs.reduce((argmax, n, i) => ( // perform `argmax`
        n > probs[argmax] ? i : argmax), 0)
    }
    const probabilities = probs.map((probability, label) => {
        return { probability, label };
    });
    return { probabilities, prediction };
  }
}