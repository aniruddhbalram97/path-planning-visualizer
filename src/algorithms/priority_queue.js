class Queue {
    constructor(elem, priority) {
    this.element = elem;
    this.priority = priority;
    }
 }
 class PriorityQueue {
    constructor() {
       this.queArr = [];
    }
    enqueue(elem, priNo) {
       let queueElem = new Queue(elem, priNo);
       let contain = false;
       for (let i = 0; i < this.queArr.length; i++) {
          if (this.queArr[i].priority > queueElem.priority) {
             this.queArr.splice(i, 0, queueElem);
             contain = true;
             break;
          }
       }
       if (!contain) {
          this.queArr.push(queueElem);
       }
    }
    dequeue() {
       if (this.isEmpty()) return "Underflow";
       return this.queArr.shift();
    }
    front() {
       if (this.isEmpty()) return "No elements in Queue";
       return this.queArr[0];
    }
    rear() {
       if (this.isEmpty()) return "The Queue is Empty..!";
       return this.queArr[this.queArr.length - 1];
    }
    isEmpty() {
       return this.queArr.length == 0;
    }
 }
 export {PriorityQueue, Queue}