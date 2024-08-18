export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.fieldY = y;
    this.speed = 0.1;
    this.cur = 0;
    this.max = Math.random() * 100 + 150;
  }

  update() {
    this.cur += this.speed;
    this.y = this.fieldY + Math.sin(this.cur) + this.max;
  }
}
