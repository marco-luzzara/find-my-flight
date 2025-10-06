import pino from 'pino';


export default class LogUtils {
    public static async logWithPerf<T>(fn: () => Promise<T>, logFn: pino.LogFn, message: string): Promise<T> {
        logFn(`BEGIN - ${message}`)

        const begin = performance.now()
        const result = await fn()
        const end = performance.now()

        logFn(`END (${end - begin} ms) - ${message}`)

        return result
    }
}