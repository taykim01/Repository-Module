import { createClient } from "@supabase/supabase-js";
export class DBRepository {
    table;
    url;
    apiKey;
    constructor(table, url, apiKey) {
        this.table = table;
        this.url = url;
        this.apiKey = apiKey;
    }
    async create(requestData) {
        const serverClient = createClient(this.url, this.apiKey);
        const { data, error } = await serverClient
            .from(this.table)
            .insert(requestData)
            .select("id");
        if (error)
            throw new Error(error.message);
        const id = data[0]?.id ?? null;
        return id;
    }
    async readOne(query, selector) {
        const serverClient = createClient(this.url, this.apiKey);
        const selectorArray = selector ? selector.join(", ") : "*";
        let querySnapshot = serverClient.from(this.table).select(selectorArray);
        for (const key in query) {
            querySnapshot = querySnapshot.eq(key, query[key]);
        }
        const { data, error } = await querySnapshot;
        if (error)
            throw new Error(error.message);
        return data[0];
    }
    async readAll(query, selector) {
        const serverClient = createClient(this.url, this.apiKey);
        const selectorArray = selector ? selector.join(", ") : "*";
        let querySnapshot = serverClient.from(this.table).select(selectorArray);
        for (const key in query) {
            querySnapshot = querySnapshot.eq(key, query[key]);
        }
        const { data, error } = await querySnapshot;
        if (error)
            throw new Error(error.message);
        return data;
    }
    async readExcept(query, selector) {
        const serverClient = createClient(this.url, this.apiKey);
        const selectorArray = selector.join(", ");
        let querySnapshot = serverClient.from(this.table).select(selectorArray);
        for (const key in query) {
            querySnapshot = querySnapshot.neq(key, query[key]);
        }
        const { data, error } = await querySnapshot;
        if (error)
            throw new Error(error.message);
        return data;
    }
    async readInclude(query, selector) {
        const serverClient = createClient(this.url, this.apiKey);
        const selectorArray = selector ? selector.join(", ") : "*";
        const { data, error } = await serverClient
            .from(this.table)
            .select(selectorArray)
            .ilike("email", `%${query}%`);
        if (error)
            throw new Error(error.message);
        return data;
    }
    async update(id, requestData) {
        const serverClient = createClient(this.url, this.apiKey);
        const { error } = await serverClient
            .from(this.table)
            .update(requestData)
            .eq("id", id)
            .select("id");
        if (error)
            throw new Error(error.message);
    }
    async deleteByID(id) {
        const serverClient = createClient(this.url, this.apiKey);
        const { error } = await serverClient.from(this.table).delete().eq("id", id);
        if (error)
            throw new Error(error.message);
    }
    async deleteAll(query) {
        const serverClient = createClient(this.url, this.apiKey);
        let querySnapshot = serverClient.from(this.table).delete();
        for (const key in query) {
            querySnapshot = querySnapshot.eq(key, query[key]);
        }
        const { error } = await querySnapshot;
        if (error)
            throw new Error(error.message);
    }
    async count(query) {
        const serverClient = createClient(this.url, this.apiKey);
        let querySnapshot = serverClient.from(this.table).select("id");
        for (const key in query) {
            querySnapshot = querySnapshot.eq(key, query[key]);
        }
        const { data, error } = await querySnapshot;
        if (error)
            throw new Error(error.message);
        return data.length;
    }
}
