type SerializableDictionary = { [key: string]: string | number | boolean }

class ApiError extends Error {
    public readonly context?: SerializableDictionary

    constructor(
        message: string,
        endpoint: string,
        options: { error?: Error, context?: SerializableDictionary } = {}
    ) {
        const { error, context } = options

        super(message)

        this.context = context
    }
}

export class ApiUnavailable extends ApiError {
    constructor(endpoint: string, options: { error?: Error, context?: SerializableDictionary } = {}) {
        super(`The API with endpoint ${endpoint} is not currently available`, endpoint, options);
    }
}

export class UninitializedSession extends ApiError {
    constructor(endpoint: string, options: { error?: Error, context?: SerializableDictionary } = {}) {
        super(`The API with endpoint ${endpoint} cannot be called without a valid session.` +
            `(Save the session retrieved from \`createSession()\`)`, endpoint, options);
    }
}

export class UnexpectedStatusCode extends ApiError {
    constructor(endpoint: string, response: Response, options: { error?: Error, context?: SerializableDictionary } = {}) {
        options.context['response'] = JSON.stringify(response)
        super(`The API with endpoint ${endpoint} returned an unexpected status code: ${response.status}`, endpoint, options);
    }
}


export class ValidationError extends Error {
    errorParamName: string

    constructor(paramName: string, actual: any, expected: string) {
        super(`'${paramName}' is initialized to: ${actual}\n` +
            `But the expected value is: ${expected}`)

        this.errorParamName = paramName
    }
}