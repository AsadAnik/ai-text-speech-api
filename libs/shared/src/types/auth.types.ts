/**
 * AUTH USER RESPONSE TYPE
 */
// region: Auth User Login Type
export type AuthUserLoginType = {
    id: string;
    email: string;
    username: string;
    accessToken: string;
    image_url?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

/**
 * AUTH USER TYPE
 */
// region: Auth User Type
export type AuthUserType = {
    id: string;
    username: string;
    email: string;
    password: string;
    image_url?: string;
    first_name?: string;
    last_name?: string;
    created_at?: Date;
    updated_at?: Date;
}

/**
 * USER PROFILE TYPE
 */
// region: User Profile Type
export type UserProfileType = {
    id: string;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    image_url?: string;
    created_at?: Date;
    updated_at?: Date;
}