"use server";

import {getDatabase, URLS_COLLECTION} from "@/db";
import {MongoServerError} from "mongodb";
import type {CreateShortUrlResult} from "@/types/CreateShortUrlResult";
import type {ShortUrl} from "@/types/ShortUrl";

export default async function createShortUrl(formData: FormData): Promise<CreateShortUrlResult> {
    const rawUrl = formData.get("url");
    const rawAlias = formData.get("alias");

    if (typeof rawUrl !== "string" || typeof rawAlias !== "string") {
        return {error: "Please provide both a URL and an alias."};
    }

    let targetUrl: URL;
    try {
        targetUrl = new URL(rawUrl.trim());
    } catch {
        return {error: "Invalid URL."};
    }

    if (targetUrl.protocol !== "https:" && targetUrl.protocol !== "http:") {
        return {error: "Invalid URL protocol. URL must use HTTP or HTTPS."};
    }

    const alias = rawAlias.trim();
    const ALIAS_PATTERN = /^[a-zA-Z0-9_\-]+$/;
    const MAX_ALIAS_LENGTH = 40;
    if (alias.length > MAX_ALIAS_LENGTH || !ALIAS_PATTERN.test(alias)){
        return {error: `Alias must be no longer than ${MAX_ALIAS_LENGTH} and can only contain a-z, A-Z, 0-9, _, and -`};
    }

    try {
        const db = await getDatabase();
        const doc: ShortUrl = {
            _id: alias,
            url: targetUrl.toString(),
            createdAt: new Date()
        };
        await db.collection<ShortUrl>(URLS_COLLECTION).insertOne(doc);
        return {
            shortPath: `/${alias}`
        };
    } catch (error) {
        const ALREADY_EXISTS = 11000;
        if (error instanceof MongoServerError && error.code === ALREADY_EXISTS) {
            return {error: "The alias is already in the database."};
        }

        console.error(
            "Failed to create short URL:",
            error instanceof Error ? error.name : "UnknownError",
        );
        return {error: "Could not create the short URL. Please try again."};
    }
}
