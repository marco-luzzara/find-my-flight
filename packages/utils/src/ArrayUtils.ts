// https://stackoverflow.com/a/34890276/5587393
export default class ArrayUtils {
    static groupBy<T, TKey>(arr: T[], keyFn: (elem: T) => TKey) {
        return arr.reduce(function(acc, x) {
            const groupKey = keyFn(x)
            if (!acc.has(groupKey))
                acc.set(groupKey, [])
            
            acc.get(groupKey).push(x)
                
            return acc;
        }, (new Map()) as Map<TKey, T[]>);
    };
}