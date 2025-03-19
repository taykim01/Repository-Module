import { createClient } from "@supabase/supabase-js";
import { Buffer } from "node:buffer";
export class StorageRepository {
    bucketName;
    url;
    apiKey;
    constructor(bucketName, url, apiKey) {
        this.bucketName = bucketName;
        this.url = url;
        this.apiKey = apiKey;
    }
    async uploadFile(file, filePath) {
        const supabase = await createClient(this.url, this.apiKey);
        const { data, error } = await supabase.storage
            .from(this.bucketName)
            .upload(filePath, file);
        if (error)
            throw new Error(error.message);
        const fileURL = data.fullPath;
        return fileURL;
    }
    async uploadBase64(base64, filePath) {
        const supabase = createClient(this.url, this.apiKey);
        const stoargeRef = supabase.storage.from(this.bucketName);
        const buffer = Buffer.from(base64, "base64");
        const { error } = await stoargeRef.upload(filePath, buffer, {
            contentType: "image/png",
            upsert: true,
        });
        if (error)
            throw new Error(error.message);
        const fileURL = stoargeRef.getPublicUrl(filePath).data.publicUrl;
        return fileURL;
    }
}
