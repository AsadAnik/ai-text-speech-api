/**
 * AUTH USER RESPONSE TYPE
 */
// region Response Type
export type AuthUserResponseType = {
    id: number;
    email: string;
    username: string;
    accessToken: string;
    image_url?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}