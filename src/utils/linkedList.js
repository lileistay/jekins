/**
*@name:单链表
*@description:
*@author:joyce
*@time:
*/

class Node {
  constructor(data) {
    this.data = data
    this.prev = null
    this.next = null
  }
}

class LinkedList {
  constructor() {
    this.size = 0
    this.head = new Node('head') // 表头节点
    this.currNode = '' // 指向当前节点
  }

  // 向链表中插入元素
  insert(item, ele) {
    const itemNode = this.find(item)
    if (!itemNode) {
      return
    }

    const newNode = new Node(ele)
    newNode.next = itemNode.next
    itemNode.next = newNode
    this.size++
  }

  // 向链表的额末尾追加元素
  append(ele) {
    const newNode = new Node(ele)
    const currNode = this.findLast()
    currNode.next = newNode
    this.size++
  }

  // 从链表中移除某个元素
  remove(item) {
    if (!this.find(item)) {
      return
    }
    if (item === 'head') {
      if (!this.isEmpty()) {
        return
      } else {
        this.head.next = null
        return
      }
    }
    let currNode = this.head
    while (currNode.next.data !== item) {
      if (!currNode.next) {
        return
      }
      currNode = currNode.next
    }
    currNode.next = currNode.next.next
    this.size--
  }

  // 修改链表某个元素
  update() {
  }

  // 寻找某个元素
  find(item) {
    let currNode = this.head
    while (currNode && (currNode.data !== item)) {
      currNode = currNode.next
    }
    return currNode
  }

  // 获取链表中的最后一个元素
  findLast() {
    let currNode = this.head
    while (currNode.next) {
      currNode = currNode.next
    }
    return currNode
  }

  // 从当前节点向前移动n个位置
  moveBefore(n, currNode = this.head) {
    this.currNode = currNode
    while ((n--) && this.currNode.next) {
      this.currNode = this.currNode.next
    }
    return this.currNode
  }

  // 获取链表的长度
  getLength() {
    return this.size
  }

  // 遍历当前链表
  display() {
    let result = ''
    let currNode = this.head
    while (currNode) {
      result += currNode.data
      currNode = currNode.next
      if (currNode) {
        result += '->'
      }
    }
  }

  // 清空链表
  clear() {
    this.head.next = null
    this.size = 0
  }

  // 显示当前节点
  show() {
  }

  // 判断链表是否为空
  isEmpty() {
    return this.size === 0
  }
}

module.exports = LinkedList
