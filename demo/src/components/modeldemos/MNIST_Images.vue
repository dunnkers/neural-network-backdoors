<template>
  <div>
    <DrawingModelUI
      :modelFilepath="modelFilepath"
      :preprocess="preprocess"
      :postprocess="postprocess"
      :getPredictedClass="getPredictedClass"
    ></DrawingModelUI>
    <canvas id="input-canvas-scaled" width="28" height="28" style="display:none;"></canvas>
    <canvas id="input-canvas-centercrop" style="display:none;"></canvas>


    <ImageModelUI
      :modelFilepath="modelFilepath"
      :imageSize="28"    
      :imageUrls="imageUrls"
      :preprocess="preprocess"
      :getPredictedClass="getPredictedClass"
    ></ImageModelUI>
  </div>
</template>

<script lang='ts'>
import _ from 'lodash';
import DrawingModelUI from '../common/DrawingModelUI.vue';
import ImageModelUI from '../common/ImageModelUI.vue';
import {Vue, Component} from 'vue-property-decorator';
import { Tensor } from 'onnxjs';
import { mathUtils } from '../../utils';
import {MNIST_IMAGE_URLS} from '../../data/sample-image-urls';

const MODEL_FILEPATH_PROD = `/onnxjs-demo/mnist_badnet.onnx`;
const MODEL_FILEPATH_DEV = '/mnist_badnet.onnx';

@Component({
  components: {
    DrawingModelUI,
    ImageModelUI
  }
})
export default class MNIST extends Vue{
  modelFilepath: string;
  imageUrls: Array<{text: string, value: string}>;

  constructor() {
    super();
    this.modelFilepath = process.env.NODE_ENV === 'production' ? MODEL_FILEPATH_PROD : MODEL_FILEPATH_DEV;
    this.imageUrls = MNIST_IMAGE_URLS;

  }

  preprocess(ctx: CanvasRenderingContext2D): Tensor {
    // center crop
    const imageDataCenterCrop = mathUtils.centerCrop(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
    const ctxCenterCrop = (document.getElementById('input-canvas-centercrop') as HTMLCanvasElement)
      .getContext('2d') as CanvasRenderingContext2D;
    ctxCenterCrop.canvas.width = imageDataCenterCrop.width;
    ctxCenterCrop.canvas.height = imageDataCenterCrop.height;
    ctxCenterCrop.putImageData(imageDataCenterCrop, 0, 0);
    // scaled to 28 x 28
    const ctxScaled = (document.getElementById('input-canvas-scaled') as HTMLCanvasElement)
      .getContext('2d') as CanvasRenderingContext2D;
    ctxScaled.save();
    ctxScaled.scale(28 / ctxCenterCrop.canvas.width, 28 / ctxCenterCrop.canvas.height);
    ctxScaled.clearRect(0, 0, ctxCenterCrop.canvas.width, ctxCenterCrop.canvas.height);
    ctxScaled.drawImage(document.getElementById('input-canvas-centercrop') as HTMLCanvasElement, 0, 0);
    const imageDataScaled = ctxScaled.getImageData(0, 0, ctxScaled.canvas.width, ctxScaled.canvas.height);
    ctxScaled.restore();
    // process image data for model input
    const { data } = imageDataScaled;
    const input = new Float32Array(784);
    for (let i = 0, len = data.length; i < len; i += 4) {
      input[i / 4] = data[i + 3] / 255;
    }

    const tensor = new Tensor(input, 'float32', [1, 1, 28, 28]);
    return tensor;
  }

  postprocess(rawOutput: Tensor): Float32Array {
    return mathUtils.softmax(Array.prototype.slice.call(rawOutput.data));
    
  }

  getPredictedClass(output: Float32Array) {
    return [
      {name: '0', probability: 0},
      {name: '1', probability: 0},
      {name: '2', probability: 0},
      {name: '3', probability: 0},
      {name: '4', probability: 0},
      {name: '5', probability: 0},
      {name: '6', probability: 0},
      {name: '7', probability: 0},
      {name: '8', probability: 0},
      {name: '9', probability: 0}
    ];
    if (output.reduce((a, b) => a + b, 0) === 0) { 
      return -1;
    }
    
    return output.reduce((argmax, n, i) => (n > output[argmax] ? i : argmax), 0);
  }

  // getOutputClasses() {
  //   let oc = [];
  //   for (let i in _.range(10)) {
  //     oc.append({
  //       name: i,
  //       probability: 
  //     })
  //   }
  //   return ;
  // }
}
</script>