// 定义一系列策略
const tween = {
  linear: (t, b, c, d) => {
    return c * t / d + b;
  },
  easeIn: (t, b, c, d) => {
    return c * (t /= d) * t + b;
  },
  easeIn: (t, b, c, d) => {
    return c * (t /= d) * t + b;
  },
  strongEaseIn: (t, b, c, d) => {
    return c * (t /= d) * t * t * t * t + b;
  },
  strongEaseOut: (t, b, c, d) => {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  },
  sineaseIn: (t, b, c, d) => {
    return c * (t /= d) * t * t + b;
  },
  sineaseOut: (t, b, c, d) => {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  },
};

class Animate {
  constructor(dom) {
    this.dom = dom;
    this.startTime = 0; // 动画开始时间
    this.startPos = 0; // 动画开始时，dom节点的位置，即dom的初始位置
    this.endPos = 0; // 动画结束时，dom节点位置，即dom的目标位置
    this.propertName = null; // dom节点需要改变的css属性名
    this.easing = null; // 动画算法
    this.duration = null; // 动画持续时间
  }
  start = (propertName, endPos, duration, easing) => {
    this.startTime = +new Date;
    this.startPos = this.dom.getBoundingClientRect()[propertName];
    this.propertName = propertName;
    this.endPos = endPos;
    this.duration = duration;
    this.easing = tween[easing];
    let timer = setInterval(() => {
      if (this.step() === false) {
        clearInterval(timer);
      }
    }, 19);
  }
  step = () => {
    const t = +new Date;
    if (t >= this.startTime + this.duration) {
      this.update(this.endPos);
      return false;
    }
    const pos = this.easing(t - this.startTime, this.startPos, this.endPos - this.startPos, this.duration);
    this.update(pos);
  }
  update = (pos) => {
    this.dom.style[this.propertName] = pos + 'px';
  }
}