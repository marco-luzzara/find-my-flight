export class UndefinedValueError extends Error {
    constructor(objDescription: string, options?: ErrorOptions) {
        super(`Object '${objDescription}' is undefined`, options);
    }
}


export class InvalidInputError extends Error {
    constructor(expected: any, actual: any, options?: ErrorOptions) {
        super(`Invalid input -\nExpected: ${expected}\nActual: ${actual}`, options);
    }
}


export class ApiError extends Error {
    public readonly endpoint: string

    constructor(
        message: string,
        endpoint: string,
        options?: ErrorOptions
    ) {
        super(message, options)
        this.endpoint = endpoint
    }
}


export class ApiUnavailableError extends ApiError {
    constructor(endpoint: string, options?: ErrorOptions) {
        super(`The API with endpoint ${endpoint} is currently unavailable`, endpoint, options);
    }
}


export class UnexpectedStatusCodeError extends ApiError {
    constructor(endpoint: string, statusCode: number, options?: ErrorOptions) {
        super(`The API with endpoint ${endpoint} returned an unexpected status code: ${statusCode}`, endpoint, options);
    }
}
