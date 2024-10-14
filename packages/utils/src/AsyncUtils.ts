export default class AsyncUtils {
    public static async* getAsSoonAsComplete<T>(promises: Iterable<Promise<T>>): AsyncGenerator<T> {
        let pendingPromises = Array.from(promises).map((p, i) => p.then(v => ({ index: i, result: v })))

        while (pendingPromises.length > 0) {
            const { index, result } = await Promise.race(pendingPromises);

            yield result;

            pendingPromises.splice(index, 1)
        }
    }
}