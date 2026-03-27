type Nullable<T> = T | null;
type Optional<T> = T | undefined;

interface ProcessEnv {
    API_KEY_BOT?: string;

    // MongoDB
    MONGO_DB_NAME?: string;
    MONGO_URI?: string;
}
