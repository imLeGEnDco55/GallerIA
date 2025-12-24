import { openDB, DBSchema } from 'idb';
import { Prompt } from '@/types/prompt';

interface GallerIADB extends DBSchema {
    prompts: {
        key: string;
        value: Prompt;
        indexes: { 'by-date': string };
    };
    settings: {
        key: string;
        value: any;
    };
}

const DB_NAME = 'GallerIA-DB';
const PROMPT_STORE = 'prompts';
const SETTINGS_STORE = 'settings';

export const dbPromise = openDB<GallerIADB>(DB_NAME, 2, {
    upgrade(db, oldVersion, newVersion, transaction, event) {
        if (oldVersion < 1) {
            const store = db.createObjectStore(PROMPT_STORE, {
                keyPath: 'id',
            });
            store.createIndex('by-date', 'createdAt');
        }
        if (oldVersion < 2) {
            db.createObjectStore(SETTINGS_STORE);
        }
    },
});

export const db = {
    async getAllPrompts(): Promise<Prompt[]> {
        const db = await dbPromise;
        return db.getAllFromIndex(PROMPT_STORE, 'by-date');
    },

    async addPrompt(prompt: Prompt): Promise<string> {
        const db = await dbPromise;
        await db.put(PROMPT_STORE, prompt);
        return prompt.id;
    },

    async updatePrompt(prompt: Prompt): Promise<string> {
        const db = await dbPromise;
        await db.put(PROMPT_STORE, prompt);
        return prompt.id;
    },

    async deletePrompt(id: string): Promise<void> {
        const db = await dbPromise;
        await db.delete(PROMPT_STORE, id);
    },

    async getCategories(): Promise<string[] | undefined> {
        const db = await dbPromise;
        return db.get(SETTINGS_STORE, 'categories');
    },

    async saveCategories(categories: string[]): Promise<void> {
        const db = await dbPromise;
        await db.put(SETTINGS_STORE, categories, 'categories');
    },

    async getGridColumns(): Promise<number | undefined> {
        const db = await dbPromise;
        return db.get(SETTINGS_STORE, 'gridColumns');
    },

    async saveGridColumns(cols: number): Promise<void> {
        const db = await dbPromise;
        await db.put(SETTINGS_STORE, cols, 'gridColumns');
    },

    async resetAllData(): Promise<void> {
        const db = await dbPromise;
        const tx = db.transaction([PROMPT_STORE, SETTINGS_STORE], 'readwrite');
        await tx.objectStore(PROMPT_STORE).clear();
        await tx.objectStore(SETTINGS_STORE).clear();
        await tx.done;
    }
};
