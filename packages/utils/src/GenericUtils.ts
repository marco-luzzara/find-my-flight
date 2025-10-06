import { LogFn } from "pino";
import LogUtils from "./LogUtils.js";


export default class GenericUtils {
    public static async fetch(fetchParams: Parameters<typeof fetch>, logFn: LogFn) {
        return await LogUtils.logWithPerf(async () => await fetch(fetchParams[0], fetchParams[1]),
            logFn,
            `Calling ${fetchParams[1]?.method} ${fetchParams[0]}`
        )
    }
}