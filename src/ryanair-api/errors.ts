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