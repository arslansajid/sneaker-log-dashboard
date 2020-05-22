
export class Admin {
    constructor(x) {
        this.uuid = x.uuid;
        this.name = x.name;
        this.email = x.email;
        this.password = x.password;
        this.confirmPassword = x.confirmPassword;
        this.timestampAdded = x.timestampAdded;
    }

    static fromFirestore(doc) {
        const data = doc.data();

        if (!data) return null;

        return new Admin({
            uuid: doc.id,
            name: data['name'] ? data['name'] : '',
            email: data['email'] ? data['email'] : [],
            password: password['password'] ? password['password'] : [],
            confirmPassword: confirmPassword['confirmPassword'] ? confirmPassword['confirmPassword'] : [],
            timestampAdded: new Date(),
        });
    }

    toJson(x) {
        return {
            uuid: x.uuid,
            name: x.name,
            email: x.email,
            password: x.password,
            confirmPassword: x.confirmPassword,
            timestampAdded: x.timestampAdded,
        };
    }
}