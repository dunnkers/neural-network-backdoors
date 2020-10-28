import { softmax } from '../utils/inference'
import { Tensor } from 'onnxjs';

const imgSize = 224;
export default {
  imgSize,

  tensor(imgdata) {
    const { data } = imgdata; // 4 channels
    const input = new Float32Array(3 * imgSize * imgSize); // 3 channels

    // skip alpha channel
    for (let i = 0, len = data.length; i < len; i += 4) {
      input[3 * i / 4] = data[i]          // R
      input[3 * i / 4 + 1] = data[i + 1]  // G
      input[3 * i / 4 + 2] = data[i + 2]  // B
    }

    const tensor = new Tensor(input, 'float32', [1, 3, imgSize, imgSize]);
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