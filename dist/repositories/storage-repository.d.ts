export default class StorageRepository {
    bucketName: string;
    url: string;
    apiKey: string;
    constructor(bucketName: string, url: string, apiKey: string);
    uploadFile(file: File, filePath: string): Promise<string>;
    uploadBase64(base64: string, filePath: string): Promise<string>;
}
