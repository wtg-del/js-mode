// 定义一系列策略
const strategies = {
  isNonEmpty: (value, errorMsg) => {
    if (value === '') {
      return errorMsg;
    }
  },
  minLength: (value, length, errorMsg) => {
    if (value.length < length) {
      return errorMsg;
    }
  },
  isMobile: (value, errorMsg) => {
    if (!/^1[3|5|6|7|8|9][0-9]{9}$/.test(value)) {
      return errorMsg
    }
  }
};

class Validator {
  cache = [];
  add(dom, reles = []) {
    reles.forEach(rele => {
      const strategyAry = rele.strategy.split(':');
      const errorMsg = rele.errorMsg;
      this.cache.push(() => {
        const strategy = strategyAry.shift();
        strategyAry.unshift(dom.value);
        strategyAry.push(errorMsg);
        return strategies[strategy](...strategyAry);
      })
    });
  }
  start() {
    for (let i = 0, validataFunc; validataFunc = this.cache[i++];) {
      const errorMsg = validataFunc && validataFunc();
      if (errorMsg) {
        return errorMsg;
      }
    }
  }
}