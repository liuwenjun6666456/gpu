import {DemoBase} from "./DemoBase";

/**
 * 一维普通傅里叶变换
 * 参考 https://zh.wikipedia.org/wiki/%E7%A6%BB%E6%95%A3%E5%82%85%E9%87%8C%E5%8F%B6%E5%8F%98%E6%8D%A2
 */
export class Demo5 extends DemoBase {
  async exec() {
    let sec = 5; // 采样总时长(s)
    let sineWave = this.dft_sineWave(sec);
    //
    console.time('cpu dft');
    const r1 = this.cpu_dft(sineWave);
    console.timeEnd(`cpu dft`);
    // console.log(r1);
    //-------------------------//
    console.time('gpu dft');
    const r2 = this.gpu_dft(sineWave);
    console.timeEnd('gpu dft');
  }

  // sec: 要生成的数据秒数
  dft_sineWave(sec) {
    let sineWave = [];
    let t = [];
    let fs = 512; // 采样率(每秒采样数)
    let freq = 10; // 频率/Hz
    let increment = 1/fs; // 基于采样率的x轴时间增量
    for (let ti = 0; ti < sec-increment; ti+=increment){ //200 sps, 3 sec
      let amplitude = Math.sin(2*Math.PI*freq*ti);
      amplitude += Math.sin(2*Math.PI*150*ti); //Add 150Hz interference
      sineWave.push(amplitude);
      t.push(ti);
    }
    return sineWave;
  }

  cpu_dft(sineWave) {
    let real = [];
    let imag = [];
    let mags = [];
    let TWOPI = 2*Math.PI;
    for(let k=0; k<sineWave.length;k++){
      real.push(0);
      imag.push(0);
      for(let j=0;j<sineWave.length;j++){
        let shared = TWOPI*k*j/sineWave.length
        real[k] = real[k]+sineWave[j]*Math.cos(shared);
        imag[k] = imag[k]-sineWave[j]*Math.sin(shared);
      }
      mags.push(Math.sqrt(real[k]*real[k]+imag[k]*imag[k]));
    }
    return mags;
  }

  gpu_dft(sineWave) {
    let gpu = new GPU();

    gpu.addFunction(function mag(a,b){
      return Math.sqrt(a*a + b*b);
    });

    gpu.addFunction(function DFT(signal,len,freq){// 提取特定频率
      let real = 0;
      let imag = 0;
      for(let i = 0; i<len; i++){
        let shared = 2*Math.PI*freq*i/len; // 提取特定频率
        real = real+signal[i]*Math.cos(shared);
        imag = imag-signal[i]*Math.sin(shared);
      }
      return [real,imag];
    });

    // 基于DFT的返回频域
    let dft = gpu.createKernel(function (signal,len){
      let result = DFT(signal,len,this.thread.x);
      return mag(result[0],result[1]);
    })
      .setDynamicOutput(true)
      .setDynamicArguments(true);

    dft.setOutput([sineWave.length]);
    dft.setLoopMaxIterations(sineWave.length);
    let gpuresult = dft(sineWave,sineWave.length);
    return gpuresult;
  }
}
