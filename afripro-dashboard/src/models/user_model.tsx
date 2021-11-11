// To parse this data:
//
//   import { Convert, UserModel } from "./file";
//
//   const userModel = Convert.toUserModel(json);

export interface UserModel {
    status: string;
    user:   User;
    token:  string;
}

export interface User {
    id:                  number;
    first_name:          string;
    last_name:           string;
    phone_number_prefix: string;
    phone_number:        string;
    email:               string;
    user_type:           string;
    email_verified_at:   string;
    blocked:             string;
    referral_code:       string;
    referred_by:         string;
    agent:               string;
    created_at:          Date;
    updated_at:          Date;
    country_code:        string;
    fcmToken:            string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toUserModel(json: string): UserModel {
        return JSON.parse(json);
    }

    public static userModelToJson(value: UserModel): string {
        return JSON.stringify(value);
    }
}
