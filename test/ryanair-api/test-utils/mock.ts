import * as fs from 'node:fs/promises'
import assert from 'node:assert'

export class MockUtils {
    public static async mockHttpGet(endpoint: string, jsonResponsePath: string = '', statusCode: number = 200): Promise<jest.Mock> {
        let jsonBody: any
        if (jsonResponsePath !== '') {
            const fileStat = await fs.stat(jsonResponsePath);
            assert(fileStat.isFile())

            jsonBody = JSON.parse(
                await fs.readFile(jsonResponsePath, { encoding: 'utf8' })
            )
        }
        else
            jsonBody = {}

        const fetchMock = jest.fn()
        global.fetch = fetchMock

        fetchMock.mockImplementation((url) => {
            if (url === endpoint) {
                return String(statusCode).match(/2\d{2}/) ?
                    Promise.resolve({
                        status: statusCode,
                        json: () => Promise.resolve(jsonBody)
                    }) :
                    Promise.reject(new Error(`API failed with ${statusCode}`))
            }
            else
                return Promise.reject(`Mocked \`fetch\` expects an endpoint (${endpoint}) that has not been called`)
        });

        return fetchMock
    }
}
