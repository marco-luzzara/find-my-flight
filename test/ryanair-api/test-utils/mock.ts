import * as fs from 'node:fs/promises'
import { jest } from '@jest/globals';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

export class MockUtils {
    public static async mockHttpGet(endpoint: string, jsonResponsePath: string = '', statusCode: number = 200) {
        mockedAxios.get.mockResolvedValue({
            data: jsonResponsePath === '' ?
                jsonResponsePath :
                JSON.parse(
                    await fs.readFile(jsonResponsePath, { encoding: 'utf8' })
                ),
            status: statusCode
        })
    }
}