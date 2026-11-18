import { getDatabase, URLS_COLLECTION } from "@/db";
import type { ShortUrl } from "@/types/ShortUrl";

export default async function getOriginalUrl(alias: string): Promise<string | null> {
    const db = await getDatabase();

    const shortUrl = await db.collection<ShortUrl>(URLS_COLLECTION).findOne({_id: alias});

    return shortUrl?.url ?? null;
}