/**
 * AUTH USER RESPONSE TYPE
 */
// region Response Type
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