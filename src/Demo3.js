import {DemoBase} from "./DemoBase";

/**
 * 图像处理: 传入 Image 图像像素
 */
export class Demo3 extends DemoBase {
  async exec() {
    const image = await this.getImageDatafromURL('cat.jpg');
    console.log('****尺寸:', image.width, image.height, 1);
    const gpu = new GPU({
      mode: 'cpu'
    });
    const kernel = gpu.createKernel(function(data) {
      const {x, y} = this.thread;
      const n = 4 * ( x + this.constants.w * (this.constants.h - y) );
      this.color(data[n]/256, data[n+1]/256, data[n+2]/256, 1);
    })
      .setConstants({ w: image.width, h: image.height })
      .setOutput([image.width, image.height])
      .setGraphical(true);
    //
    kernel(image.data); // 输入像素
    $(document.body).append(kernel.canvas);
  }
}
