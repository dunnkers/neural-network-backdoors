import { softmax, argmax } from '../utils/inference'
import { Tensor } from 'onnxjs';
import labels from './MobileNet_labels';

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
    const prediction = argmax(probs);
    const probabilities = probs.map((probability, i) => {
        return { probability, label: labels[i] };
    });
    return { probabilities, prediction };
  }
}