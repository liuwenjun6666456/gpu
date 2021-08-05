import {Demo1} from "./Demo1";
import {Demo2} from "./Demo2";
import {Demo3} from "./Demo3";
import {Demo4} from "./Demo4";
import {Demo5} from "./Demo5";

class PlayerDemo {
  constructor() {
    new Demo2().exec();
  }
}

$(() => {
  new PlayerDemo();
});



