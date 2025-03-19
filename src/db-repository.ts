import { createClient } from "@supabase/supabase-js";

export class DBRepository<Entity> {
  constructor(
    public table: string,
    public url: string,
    public apiKey: string
  ) {}

  async create(requestData: Partial<Entity>): Promise<string> {
    const serverClient = createClient(this.url, this.apiKey);
    const { data, error } = await serverClient
      .from(this.table)
      .insert(requestData)
      .select("id");
    if (error) throw new Error(error.message);
    const id = data[0]?.id ?? null;
    return id;
  }

  async readOne<K extends keyof Entity>(
    query: Record<K, Entity[K]>,
    selector?: (keyof Entity)[]
  ): Promise<Entity> {
    const serverClient = createClient(this.url, this.apiKey);
    const selectorArray = selector ? selector.join(", ") : "*";
    let querySnapshot = serverClient.from(this.table).select(selectorArray);
    for (const key in query) {
      querySnapshot = querySnapshot.eq(key as string, query[key]);
    }
    const { data, error } = await querySnapshot;
    if (error) throw new Error(error.message);
    return data[0] as Entity;
  }

  async readAll<K extends keyof Entity>(
    query: Record<K, Entity[K]>,
    selector?: (keyof Entity)[]
  ): Promise<Entity[]> {
    const serverClient = createClient(this.url, this.apiKey);
    const selectorArray = selector ? selector.join(", ") : "*";
    let querySnapshot = serverClient.from(this.table).select(selectorArray);
    for (const key in query) {
      querySnapshot = querySnapshot.eq(key as string, query[key]);
    }
    const { data, error } = await querySnapshot;
    if (error) throw new Error(error.message);
    return data as Entity[];
  }

  async readExcept<K extends keyof Entity>(
    query: Record<K, Entity[K]>,
    selector: K[]
  ): Promise<Entity[]> {
    const serverClient = createClient(this.url, this.apiKey);
    const selectorArray = selector.join(", ");

    let querySnapshot = serverClient.from(this.table).select(selectorArray);
    for (const key in query) {
      querySnapshot = querySnapshot.neq(key as string, query[key]);
    }
    const { data, error } = await querySnapshot;
    if (error) throw new Error(error.message);
    return data as Entity[];
  }

  async readInclude<K extends keyof Entity>(
    query: string,
    selector?: K[]
  ): Promise<Entity[]> {
    const serverClient = createClient(this.url, this.apiKey);
    const selectorArray = selector ? selector.join(", ") : "*";

    const { data, error } = await serverClient
      .from(this.table)
      .select(selectorArray)
      .ilike("email", `%${query}%`);

    if (error) throw new Error(error.message);
    return data as Entity[];
  }

  async update(id: string, requestData: Partial<Entity>) {
    const serverClient = createClient(this.url, this.apiKey);
    const { error } = await serverClient
      .from(this.table)
      .update(requestData)
      .eq("id", id)
      .select("id");
    if (error) throw new Error(error.message);
  }

  async deleteByID(id: string): Promise<void> {
    const serverClient = createClient(this.url, this.apiKey);
    const { error } = await serverClient.from(this.table).delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  async deleteAll<K extends keyof Entity>(
    query: Record<K, Entity[K]>
  ): Promise<void> {
    const serverClient = createClient(this.url, this.apiKey);
    let querySnapshot = serverClient.from(this.table).delete();
    for (const key in query) {
      querySnapshot = querySnapshot.eq(key as string, query[key]);
    }
    const { error } = await querySnapshot;
    if (error) throw new Error(error.message);
  }

  async count<K extends keyof Entity>(
    query: Record<K, Entity[K]>
  ): Promise<number> {
    const serverClient = createClient(this.url, this.apiKey);
    let querySnapshot = serverClient.from(this.table).select("id");
    for (const key in query) {
      querySnapshot = querySnapshot.eq(key as string, query[key]);
    }
    const { data, error } = await querySnapshot;
    if (error) throw new Error(error.message);
    return data.length;
  }
}
