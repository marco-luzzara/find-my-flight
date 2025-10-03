import pino from 'pino';
import { env } from './envs';

export default class LogUtils {
    public static getLogger(metaProperties?: { [key: string]: any }) {
        const logLevel = ['test', 'development'].includes(env.NODE_ENV) ? 'debug' : 'info'

        return pino({
            level: logLevel,
            base: metaProperties ?? {}
        })
    }
}