const $math = require('mathjs')
export const math = {
  // 加
  add() {
    return comp('add', arguments)
  },
  // 减
  subtract() {
    return comp('subtract', arguments)
  },
  // 乘
  multiply() {
    return comp('multiply', arguments)
  },
  // 除
  divide() {
    return comp('divide', arguments)
  }
}
function comp (_func, args) {
  let t = $math.chain($math.bignumber(args[0]))
  for (let i = 1; i < args.length; i++) {
    t = t[_func]($math.bignumber(args[i]));
  }
  // 防止超过6位使用科学计数法
  return parseFloat(t.done())
}
