import { softmax, argmax } from '../utils/inference'
import { Tensor } from 'onnxjs';
import labels from './MobileNet_labels';

function normalize(img, mean, std) {
  
}



const imgSize = 224;
export default {
  imgSize,

  tensor(imgdata, ctx) {
    const { data } = imgdata; // 4 channels
    const input = new Float32Array(3 * imgSize * imgSize); // 3 channels

    const mean = [0.485, 0.456, 0.406]
    const std = [0.229, 0.224, 0.225]
    for (let i = 0, len = data.length; i < len; i += 4) {
      input[i/4] = (data[i] - 255 * mean[0]) / (255 * std[0])  
      input[imgSize*imgSize + i/4] = (data[i + 1] - 255 * mean[1]) / (255 * std[1])
      input[2*imgSize*imgSize + i/4] = (data[i + 2] - 255 * mean[2]) / (255 * std[2])
    }

    const tensor = new Tensor(input, 'float32', [1, 3, imgSize, imgSize]);
    return tensor;
  },

  postprocess(outputdata) {
    const probs = softmax(Array.prototype.slice.call(outputdata));
    console.log(probs)
    const prediction = probs.indexOf(Math.max(...probs))
    //const prediction = argmax(probs);
    console.log(prediction)
    const probabilities = probs.map((probability, i) => {
        return { probability, label: labels[i] };
    });
    return { probabilities, prediction };
  }
}