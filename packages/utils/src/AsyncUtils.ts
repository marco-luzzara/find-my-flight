class WrappedError extends Error {
    error: Error
    context: any

    constructor(error: Error, context: any) {
        super(error.message)
        this.error = error
        this.context = context
    }
}

enum PromiseState {
    Pending,
    Fulfilled,
    Rejected
}

export default class AsyncUtils {
    /**
     * Returns promises as soon as they are settled (either resolved or rejected). This utility method
     * never throws, but it returns an object with the `err` property filled in case of promise reject.
     * @param promises The iterable of promises 
     */
    public static async* getAsSoonAsSettled<T>(promises: Iterable<Promise<T>>): AsyncGenerator<{
        isResolved: true,
        result: T
    } | {
        isResolved: false,
        error: any
    }> {
        let pendingPromises: Promise<{ index: number, result: any }>[] = Array.from(promises)
            .map((p, i) => p
                .then(v => ({ index: i, result: v }))
                .catch(err => {
                    throw new WrappedError(err, { index: i })
                })
            )

        while (pendingPromises.length > 0) {
            let promiseIndex: number
            try {
                const { index, result } = await Promise.race(pendingPromises);
                promiseIndex = index
                yield {
                    isResolved: true,
                    result
                }
            }
            catch (err) {
                promiseIndex = err.context.index
                yield {
                    isResolved: false,
                    error: err.error.message
                }
            }

            pendingPromises.splice(promiseIndex, 1)
        }
    }

    /**
     * Synchronously wait for a promise to complete.
     * Extracted from deasync library (https://github.com/Kaciras/deasync/blob/master/index.ts)
     * **Use only when async programming is not available (top-level code in a CommonJS module).
     * @param promise 
     * @returns 
     */
    public static awaitSync<T>(promise: Promise<T>): T {
        let state = PromiseState.Pending;
        let resultOrError: unknown;

        promise.then(res => {
            resultOrError = res;
            state = PromiseState.Fulfilled;
        }, err => {
            resultOrError = err;
            state = PromiseState.Rejected;
        });

        while (state === PromiseState.Pending) { }

        if (state === PromiseState.Rejected) {
            throw resultOrError;
        } else {
            return resultOrError as T;
        }
    }
}