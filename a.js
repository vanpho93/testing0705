class Person {
    constructor(name) {
        this.name = name;
    }

    sayHello() { console.log(`Hello, I am ${this.name}`); }
}

class Child extends Person {
    constructor(name, age) {
        super(name);
        this.age = age;
    }
}

const teo = new Child('Teo Nguyen', 10);
teo.sayHello();
console.log(teo);