export class DemoBase {
  constructor() {
  }

  getImageDatafromURL(url) {
    return new Promise((resolve, reject) => {
      const image = new Image;
      image.onload = () => resolve(this.getimagedata(image));
      image.onerror = reject;
      image.crossOrigin = "anonymous";
      image.src = url;
    });
  }

  getimagedata(v) {
    const w = v.width;
    const h = v.height;
    const context = this.createContext2d(w, h, 1);
    context.drawImage(v, 0, 0, w, h);
    return context.getImageData(0, 0, w, h);
  }

  createContext2d(width, height, devicePixelRatio = 1) {
    if (!devicePixelRatio) devicePixelRatio = window.devicePixelRatio;
    const canvas = document.createElement('canvas');
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = width + 'px';
    const context = canvas.getContext('2d');
    context.scale(devicePixelRatio, devicePixelRatio);
    return context;
  }

  getPixelsFromImage(imgSrc) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0,0, img.width, img.height);
        resolve({image: imageData});
      };
      img.onerror = reject;
    });
  }
}
