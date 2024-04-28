export class List {
  constructor(name, items = []) {
    this.name = name;
    this.items = items;
  }
}

export class BoardLists {
  static encode(lists) {
    return JSON.stringify(lists);
  }

  static decode(lists) {
    return JSON.parse(lists);
  }
}

export class Item {
  constructor(name, isLow = false) {
    this.name = name;
    this.isLow = isLow;
  }
}

export class Board {
  constructor(name, lists = []) {
    this.name = name;
    this.lists = lists;
  }

  encode() {
    return { name: this.name, lists: JSON.stringify(this.lists) };
  }
}
