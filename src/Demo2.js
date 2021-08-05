import {DemoBase} from "./DemoBase";

/**
 * 图像处理: 传入 Image 图像
 */
export class Demo2 extends DemoBase {
  async exec() {
    const gpu = new GPU({
      mode: 'gpu'
    });
    //
    const image = document.createElement('img');
    image.src = 'cat.jpg';
    image.onload = () => {
      const kernel = gpu.createKernel(function(image) {
        // this.thread.y 像素列下标
        // this.thread.x 像素行下标
        const pixel = image[this.thread.y][this.thread.x];
        let r = pixel[0];
        let g = pixel[1];
        let b = pixel[2];
        let a = pixel[3];
        //计算灰度的公式
        let grey = 0.3*r + 0.59*g + 0.11*b;
        r = grey;
        g = grey;
        b = grey;
        this.color(r, g, b, a);
      })
        .setGraphical(true)
        .setOutput([image.width, image.height]);
      // 传入 <img> 对象
      kernel(image); // 输入值并进行计算
      $(document.body).append(kernel.canvas);
    };
  }
}
