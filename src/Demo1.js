import {GPU} from 'gpu.js';
import {DemoBase} from './DemoBase';

export class Demo1 extends DemoBase {

  async exec() {
    const gpu = new GPU();

    const kernel = gpu.createKernel(function() {
      return 1;
    }).setOutput([3, 2]);
    const c = kernel();
    console.log(c);

    // const kernel = gpu.createKernel(function() {
    //   const i = 1;
    //   const j = 0.8;
    //   return i + j;
    // }).setOutput([100]);
    // const c = kernel();
    // console.log(c);

    // const add = gpu.createKernel(function(a) {
    //   let d = 0;
    //   for(let i=0;i<5;i++) {
    //     d+=a[i];
    //   }
    //   return d;
    // }).setOutput([5]);
    // const cc = add([1,2,3,4,5]);
    // console.log('************',cc);
  }
}
