declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    MONGO_URI: string;
    SESSION_SECRET: string;
    CLIENT_BASE_URL: string;
    PERSONAL_EMAIL: string;
  }
}
