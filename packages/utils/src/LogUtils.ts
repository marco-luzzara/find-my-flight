import winston from "winston";

export default class LogUtils {
    public static getLogger(metaProperties?: { [key: string]: any }) {
        const logLevel = ['test', 'development'].includes(process.env.NODE_ENV) ? 'debug' : 'info'

        return winston.createLogger({
            transports: [new winston.transports.Console({ level: logLevel })],
            defaultMeta: metaProperties ?? {}
        })
    }
}