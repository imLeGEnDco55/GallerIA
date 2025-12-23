import { openDB, DBSchema } from 'idb';
import { Prompt } from '@/types/prompt';

interface GallerIADB extends DBSchema {
    prompts: {
        key: string;
        value: Prompt;
        indexes: { 'by-date': string };
    };
}

const DB_NAME = 'GallerIA-DB';
const STORE_NAME = 'prompts';

export const dbPromise = openDB<GallerIADB>(DB_NAME, 1, {
    upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
        });
        store.createIndex('by-date', 'createdAt');
    },
});

export const db = {
    async getAllPrompts(): Promise<Prompt[]> {
        const db = await dbPromise;
        return db.getAllFromIndex(STORE_NAME, 'by-date');
    },

    async addPrompt(prompt: Prompt): Promise<string> {
        const db = await dbPromise;
        await db.put(STORE_NAME, prompt);
        return prompt.id;
    },

    async updatePrompt(prompt: Prompt): Promise<string> {
        const db = await dbPromise;
        await db.put(STORE_NAME, prompt);
        return prompt.id;
    },

    async deletePrompt(id: string): Promise<void> {
        const db = await dbPromise;
        await db.delete(STORE_NAME, id);
    },

    // Helper to convert Blob/File to Base64 (if needed for other storages, but IDB supports blobs directly in Chrome/Android)
    // For safety in this specific Capacitor/Vite React stack, storing as DataURLs (strings) is easiest to render immediately,
    // but let's assume the existing code uses strings for URLs.
};
