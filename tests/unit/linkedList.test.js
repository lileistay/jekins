/**
@name:链表测试
@description: 系统无法执行脚本 管理员执行Set-ExecutionPolicy RemoteSigned 执行命令: mocha 需要测试的文件名
@author: joyce
@time: 2021-12-31 10:24:37
*/
const expect = require('chai').expect
const LinkedList = require('../../src/utils/linkedList')

const link = new LinkedList()

// 链表的添加、插入、显示、长度
function linkGetLength() {
  link.append(1)
  link.append(2)
  link.append(3)
  link.insert(1, 4)
  link.append(4)
  link.display()
  return link.getLength()
}
//eslint -disable-next-line no-undef
describe('链表的添加、插入、显示、长度', function() {
  // eslint-disable-next-line no-undef
  it('执行结果 ', function() {
    expect(linkGetLength()).to.be.equal(5)
  })
})

function linkRemove() {
  link.append(1)
  link.append(2)
  link.append(3)
  link.insert(1, 4)
  link.append(4)
  link.display()
  link.remove(2)
  link.display()
  console.log(link.findLast())
  console.log('moveBefore--------')
  link.moveBefore(1, 3)
  link.display()
  link.show()
  console.log(link.isEmpty())
  console.log('clear---------')
  link.clear()
  return link.getLength()
}
// eslint-disable-next-line no-undef
describe('单链表的删除、清空等测试', function() {
  // eslint-disable-next-line no-undef
  it('执行结果 ', function() {
    expect(linkRemove()).to.be.equal(0)
  })
})
