import pino from 'pino';

export default class LogUtils {
    public static getLogger(metaProperties?: { [key: string]: any }) {
        const logLevel = ['test', 'development'].includes(process.env.NODE_ENV) ? 'debug' : 'info'

        return pino({
            level: logLevel,
            base: metaProperties ?? {}
        })
    }
}