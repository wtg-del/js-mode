class Core {
  defaultNamespace = '__namespace__';
  namespaceCache = {};
  static each(ary, fn) {
    let ret;
    for (let i = 0, l = ary.length; i < l; i++) {
      const n = ary[i];
      ret = fn.call(n, n, i);
    }
    return ret;
  }
  static listen(key, fn, cache) {
    if (!cache[key]) {
      cache[key] = [];
    }
    cache[key].push(fn);
  }
  static remove(key, cache, fn) {
    if (!cache[key]) return;
    if (fn) {
      for (let i = cache[key].length; i >= 0; i--) {
        if (cache[key][i] === fn) {
          cache[key][i] = null;
        }
      }
    } else {
      cache[key] = [];
    }
  }
  static trigger(key, cache, ...args) {
    const stack = cache[key];
    if (!stack || !stack.length) {
      return;
    }
    return Core.each(stack, (fn) => {
      return fn && fn.apply(this, args);
    });
  }
  create(namespace = this.defaultNamespace) {
    let cache = {}, offlineStack = [];
    const listen = function (key, fn, last) {
      Core.listen(key, fn, cache);
      if (offlineStack === null) {
        return;
      }
      if (last === 'last') {
        offlineStack.length && offlineStack.pop()();
      } else if (offlineStack.length) {
        Core.each(offlineStack, function () {
          this();
        });
      }
      offlineStack = null;
    };
    const one = function (key, fn, last) {
      Core.remove(key, cache);
      this.listen(key, fn, last);
    };
    const remove = function (key, fn) {
      Core.remove(key, cache, fn);
    };
    const trigger = function (key, ...args) {
      const _self = this;
      const fn = function () {
        return Core.trigger.call(_self, key, cache, ...args);
      }
      if (offlineStack) {
        return offlineStack.push(fn);
      }
      return fn();
    };
    const ret = {
      listen, one, remove, trigger,
    };
    return this.namespaceCache[namespace] || (this.namespaceCache[namespace] = ret);
  }
}

class _Event extends Core {
  listen(key, fn, last) {
    const event = this.create();
    event.listen(key, fn, last);
  }
  trigger() {
    const event = this.create();
    event.trigger.apply(this, arguments);
  }
  remove(key, fn, last) {
    const event = this.create();
    event.remove(key, fn, last);
  }
  one(key, fn, last) {
    const event = this.create();
    event.one(key, fn, last);
  }
}


const Event = new _Event();