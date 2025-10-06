import { ApiError } from "@findmyflight/utils";

export class UninitializedSessionError extends ApiError {
    constructor(endpoint: string, options?: ErrorOptions) {
        super(`The API with endpoint ${endpoint} cannot be called without a valid session.` +
            `(Save the session retrieved from \`createSession()\`)`, endpoint, options);
    }
}
