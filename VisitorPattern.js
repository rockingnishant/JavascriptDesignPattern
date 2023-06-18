/** Visitor pattern */





let elems = [
  { tagName: "div", style: { width: 300, height: 300 } },
  {
    tagName: "div",
    style: { width: 300, height: 300 },
    children: [
      { tagName: "input", style: { width: 300, height: 300 } },
      { tagName: "select", style: { width: 300, height: 300 } },
    ],
  },
];

// base class of node
class Node {
  constructor(value) {
    this.value = value;
  }
  accept(visitor) {
    visitor.visit(this);
  }
}
// base class of visitor
class Visitor {
  visit(node) {}
}

class SelectOptionVisitor extends Visitor {
  constructor(options) {
    super();
    this.options = options;
  }
  visit(node) {
    if (node.value.tagName === "select") {
        //console.log('node.value inside if',node.value)
      node.value.options = this.options.map((option) => ({
        tagName: "option",
        value: option,
        text: option[0].toUpperCase() + option.slice(1),
      }));
    }
  }
}

const traverse = function traverseNodes(elements, visitorProp) {
  const visitors = [];
  if (visitorProp) {
    (Array.isArray(visitorProp) ? visitorProp : [visitorProp]).forEach(
      (visitor) => visitors.push(visitor)
    );
  } else {
    throw new Error(`No Visitors to run`);
  }

  const nodes = elements.map((element) => {
    const node = new Node(element);
    for (const visitor of visitors) {
      node.accept(visitor);
      if (node.value.children) {
        traverse(node.value.children, visitors);
      }
    }
    return node;
  });

  return {
    [Symbol.for('nodejs.util.inspect.custom')](){
        return this.toJSON();
    },
    toJSON() {
      return nodes.map((node) => node.value);
    },
    toString() {
        return JSON.stringify(this.toJSON());
      },
  };
};
const selectOptionVisitor = new SelectOptionVisitor(["Jan", "feb", "mar"]);

console.log("before transformation", JSON.stringify(elems));
const traversed = traverse(elems, [selectOptionVisitor]);
console.log("---------------------------------------------------------------------------------------");
console.log("after transformation stringify", traversed.toString());
console.log("---------------------------------------------------------------------------------------");
console.log("after transformation printing originsl elems", JSON.stringify(elems));
