export default class AsyncUtils {
    public static async* getAsSoonAsReady<T>(promises: Iterable<Promise<T>>): AsyncGenerator<T> {
        let pendingPromises = [...promises]

        while (pendingPromises.length > 0) {
            const fastestPromise = await Promise.race(pendingPromises);

            yield fastestPromise;

            pendingPromises = pendingPromises.filter(p => p !== fastestPromise);
        }
    }
}