import * as dotenv from "dotenv";
import * as path from "path";

const env = process.env.ENV || "test";
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });

function required(key: string): string {
    const value = process.env[key];
    if (!value) throw new Error(`Missing required env var: "${key}"`);
    return value;
}

const AUTH_DIR = path.resolve(process.cwd(), ".auth");

export const USERS = {
    standardUser: {
        username: required("STANDARD_USER_USERNAME"),
        password: required("STANDARD_USER_PASSWORD"),
        authFile: path.join(AUTH_DIR, "standardUser.json"),
    },
    lockedOutUser: {
        username: required("LOCKED_OUT_USER_USERNAME"),
        password: required("LOCKED_OUT_USER_PASSWORD"),
        authFile: path.join(AUTH_DIR, "lockedOutUser.json"),
    },
    problemUser: {
        username: required("PROBLEM_USER_USERNAME"),
        password: required("PROBLEM_USER_PASSWORD"),
        authFile: path.join(AUTH_DIR, "problemUser.json"),
    },
    performanceGlitchUser: {
        username: required("PERFORMANCE_GLITCH_USER_USERNAME"),
        password: required("PERFORMANCE_GLITCH_USER_PASSWORD"),
        authFile: path.join(AUTH_DIR, "performanceGlitchUser.json"),
    },
    errorUser: {
        username: required("ERROR_USER_USERNAME"),
        password: required("ERROR_USER_PASSWORD"),
        authFile: path.join(AUTH_DIR, "errorUser.json"),
    },
    visualUser: {
        username: required("VISUAL_USER_USERNAME"),
        password: required("VISUAL_USER_PASSWORD"),
        authFile: path.join(AUTH_DIR, "visualUser.json"),
    },
} as const;

export type UserKey = keyof typeof USERS;

//Below was what I had earlier
// export type Users = typeof USERS;
// export type UserKey = keyof Users;
// export type User = Users[UserKey];

export const ENV = {
    BASE_URL: required("BASE_URL"),
    USERS,
} as const;