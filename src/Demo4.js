import {DemoBase} from "./DemoBase";

export class Demo4 extends DemoBase {
  async exec() {
    this.matSize = 512;

    const {A, B} = this.generateMatrices();

    // CPU
    const startCPU = window.performance.now();
    const cpuResult = this.cpuMatMult(A, B);
    const endCPU = window.performance.now();
    const cpuTime = endCPU - startCPU;
    console.log(`~~~CPU 耗时: ${cpuTime} ms`);

    // GPU
    const startGPU = window.performance.now();
    const result = this.gpuMatMult(A, B);
    const endGPU = window.performance.now();
    const gpuTime = endGPU - startGPU;
    console.log(`~~~GPU 耗时: ${gpuTime} ms`);

    //Diff
    const diff = (cpuTime - gpuTime) / (gpuTime);
    console.log(`*********** CPU 比 GPU 快 ${diff} ms`);
  }

  gpuMatMult(A, B) {
    const gpu = new GPU({
      mode: 'gpu'
    });

    const result =  gpu.createKernel(function (A, B) {
      var sum = 0;
      for (var i = 0; i < this.constants.matSize; i++) {
        sum += A[this.thread.y][i] * B[i][this.thread.x];
      }
      return sum;
    })
      .setDimensions([A.length, B.length])
      .setConstants({matSize: this.matSize})
      .setOutputToTexture(true);
    return result(A, B);
  }

  cpuMatMult(m, n) {
    var result = [];
    for (var i = 0; i < m.length; i++) {
      result[i] = [];
      for (var j = 0; j < n[0].length; j++) {
        var sum = 0;
        for (var k = 0; k < m[0].length; k++) {
          sum += m[i][k] * n[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  }

  // 返回矩阵 A、B
  generateMatrices() {
    const matSize = this.matSize;
    let A = [];
    let B = [];
    for (let n = 0; n < matSize * matSize; n++) {
      const randA = Math.random();
      const randB = Math.random();
      A.push(randA);
      B.push(randB);
    }

    A = splitArray(A, matSize);
    B = splitArray(B, matSize);

    function splitArray(array, part) {
      var tmp = [];
      for (var i = 0; i < array.length; i += part) {
        tmp.push(array.slice(i, i + part));
      }
      return tmp;
    }

    return {
      A,
      B
    };
  }
}
