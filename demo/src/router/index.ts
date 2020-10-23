import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/Home.vue';
import Resnet50 from '../components/modeldemos/Resnet50.vue';
import SqueezeNet from '../components/modeldemos/Squeezenet.vue';
import Emotion from '../components/modeldemos/Emotion.vue';
import Yolo from '../components/modeldemos/Yolo.vue';
import MNIST from '../components/modeldemos/MNIST.vue';
import MNIST_Images from '../components/modeldemos/MNIST_Images.vue';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      name: 'home',
      component: Home,
    },
    {
      path: '/resnet50',
      component: Resnet50,
    },
    {
      path: '/squeezenet',
      component: SqueezeNet,
    },
    {
      path:'/emotion_ferplus',
      component: Emotion,
    },
    {
      path: '/yolo',
      component: Yolo,
    },
    {
      path:'/mnist',
      component: MNIST,
    },
    {
      path:'/mnist_images',
      component: MNIST_Images,
    }
  ],
});
