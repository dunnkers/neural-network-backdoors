import { Tensor } from 'onnxjs';

function softmax(arr) {
    const C = Math.max(...arr);
    const d = arr.map((y) => Math.exp(y - C)).reduce((a, b) => a + b);
    return arr.map(value => { 
        return Math.exp(value - C) / d;
    });
}

// MNIST post-processing
function postprocess(outputdata) {
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

// MNIST image data to Tensor
export function imgToTensor(imgdata) {
    const { data } = imgdata;
    const input = new Float32Array(784);
    for (let i = 0, len = data.length; i < len; i += 4) {
        // input[i / 4] = data[i + 3] / 255;
        // const a = data[i + 3]; // is always 255

        // To Grayscale -> average over RGB
        // const r = data[i];
        // const g = data[i + 1];
        // const b = data[i + 2];
        // input[i / 4] = ((r + g + b) / 3) / 255;

        // To Grayscale
        input[i / 4] =  data[i] * 0.299 +           // R
                        data[i + 1] * 0.587 +       // G
                        data[i + 2] * 0.114 - 127.5 // B
    }
    const tensor = new Tensor(input, 'float32', [1, 1, 28, 28]);
    return tensor;
}
  
// MNIST inference
export async function infer(session, tensor) {
    const start = new Date();
    const outputData = await session.run([ tensor ]);
    const end = new Date();
    const time = (end.getTime() - start.getTime());
    const output = outputData.values().next().value;
    // Postprocess
    const { probabilities, prediction } = postprocess(output.data);
    return { time, probabilities, prediction }
}