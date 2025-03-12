export class MyClass {
    private name: string;
  
    constructor(name: string) {
      this.name = name;
    }
  
    greet() {
      return `Hello, ${this.name}!`;
    }
}

export const myFunction = (value: number): number => {
    return value * 2;
};
