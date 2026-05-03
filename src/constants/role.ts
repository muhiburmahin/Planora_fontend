export const Roles = {
    ADMIN: "ADMIN",
    USER: "USER",
} as const;

export type Role = keyof typeof Roles;
