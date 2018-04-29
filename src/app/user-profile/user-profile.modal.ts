export class UserProfile {
    id: string;
    username: string;
    password: string;
    email: string;
    profilePic: string;

    constructor( id?: string , username?: string, password?: string,  email?: string, profilePic?: string) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.profilePic = profilePic;
    }
}
