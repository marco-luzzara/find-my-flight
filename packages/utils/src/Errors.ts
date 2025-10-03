export class UndefinedValueError extends Error {
    constructor(objDescription: string) {
        super(`Object ${objDescription} is undefined`);
    }
}


export class InvalidInputError extends Error {
    constructor(expected: string, actual: string) {
        super(`Invalid input error -\nExpected: ${expected}\nActual: ${actual}`);
    }
}