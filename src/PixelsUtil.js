import {GPU} from 'gpu.js';

export class PixelsUtil {

  /**
   * 执行 GPU 函数
   * 内部变量: this.color、this.constants
   * 1. 输入像素示例
   * const imageData = PixelsUtil.getImageDatafromURL('xxx.jpg');
   * const kernel = PixelsUtil.createKernel({
   *   width: xxx,
   *   height: xxx,
   *   constants: {w: xxx, h: xxx},
   *   exec: function () {
   *     const {x, y} = this.thread;
   *     const n = 4 * (x + this.constants.w * (this.constants.h - y));
   *     this.color(data[n] / 256, data[n + 1] / 256, data[n + 2] / 256, 1);
   *   }
   * });
   * kernel(new Input(imageData.data, [imageData.data.length])); // 输入像素
   * $(document.body).append(kernel.canvas);
   *
   * 2. 输入图像对象示例
   * const image = PixelsUtil.getImagefromURL('xxx.jpg');
   * const kernel = PixelsUtil.createKernel({
   *    width: xxx,
   *    height: xxx,
   *    constants: {w: xxx, h: xxx},
   *    exec: function () {
   *      const pixel = image[this.thread.y][this.thread.x];
   *      const grey = 0.3 * pixel[0] + 0.59 * pixel[1] + 0.11 * pixel[2]; // 计算灰度的公式
   *      this.color(grey, grey, grey, pixel[3]);
   *    }
   *  });
   * kernel(image); // 输入 Image 对象
   * $(document.body).append(kernel.canvas);
   * @param param {mode, width, height, constants, exec}
   */
  static async createKernel(param) {
    const {image,width,height,constants, exec} = param;
    const gpu = new GPU({
      mode: 'cpu'
    });
    const kernel = gpu.createKernel(function(data) {
      const {x, y} = this.thread;
      const n = 4 * (x + this.constants.w * (this.constants.h - y)); // 定位像素位置
      this.color(data[n] / 256, data[n + 1] / 256, data[n + 2] / 256, 1);
    })
      .setOutput([width, height])
      .setGraphical(true);
    if(constants) {
      kernel.setConstants(constants);
    }
    //
    $(document.body).append(kernel.canvas);
    kernel(image.data); // 输入像素
  }

  /**
   * 获取图片的 ImageData 数据
   * @param url
   * @returns {Promise<ImageData>}
   */
  static async getImageDatafromURL(url) {
    const image = PixelsUtil.getImagefromURL(url);
    return PixelsUtil.getImageDataFromSource(image);
  }

  /**
   * 获取图片 Image 对象
   * @param url
   * @returns {Promise<Image>}
   */
  static getImagefromURL(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.crossOrigin = 'anonymous';
      image.src = url;
    });
  }

  /**
   *
   * @param source  Image|<video> 对象
   * @returns {ImageData}
   */
  static getImageDataFromSource(source) {
    const w = source.width;
    const h = source.height;
    const context = PixelsUtil.createContext2d(w, h);
    context.drawImage(source, 0, 0, w, h);
    return context.getImageData(0, 0, w, h);
  }

  /**
   * 创建canvas渲染上下文
   * @param width
   * @param height
   * @param devicePixelRatio
   * @returns {CanvasRenderingContext2D}
   */
  static createContext2d(width, height, devicePixelRatio = 1) {
    if (!devicePixelRatio) {
      devicePixelRatio = window.devicePixelRatio;
    }
    const canvas = document.createElement('canvas');
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    const context = canvas.getContext('2d');
    context.scale(devicePixelRatio, devicePixelRatio);
    return context;
  }
}
