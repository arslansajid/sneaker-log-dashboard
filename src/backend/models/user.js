export class User {

    constructor(x) {
        this.uuid = x.uuid;
        this.name = x.name;
        this.userName = x.userName;
        this.isActive = x.isActive;
        this.phone = x.phone;
        this.collections = x.collections;
        this.sneakerSize = x.sneakerSize;
        this.exports = x.exports;
        this.sneakerCount = x.sneakerCount;
        this.sneakerScans = x.sneakerScans;
        this.timestampRegister = x.timestampRegister;
        this.profileImage = x.profileImage;
    }

    static fromFirestore(doc) {
        const data = doc.data();

        if (!data) return null;

        return new User({
            uuid: doc.id,
            name: data['name'] ? data['name'] : '',
            userName: data['userName'] ? data['userName'] : '',
            isActive: data['isActive'] ? data['isActive'] : false,
            phone: data['phone'] ? data['phone'] : '',
            collections: data['collections'] ? data['collections'] : '',
            sneakerSize: data['sneakerSize'] ? data['sneakerSize'] : '',
            exports: data['exports'] ? data['exports'] : '',
            sneakerCount: data['sneakerCount'] ? data['sneakerCount'] : '',
            sneakerScans: data['sneakerScans'] ? data['sneakerScans'] : '',
            timestampRegister: data['timestampRegister'] ? data['timestampRegister'] : '',
            profileImage: data['profileImage'] ? data['profileImage'] : '',
        });
    }

    toJson(x) {
        return {
            uuid: x.uuid,
            name: x.name,
            userName: x.userName,
            isActive: x.isActive,
            phone: x.phone,
            collections: x.collections,
            sneakerSize: x.sneakerSize,
            exports: x.exports,
            sneakerCount: x.sneakerCount,
            sneakerScans: x.sneakerScans,
            timestampRegister: x.timestampRegister,
            profileImage: x.profileImage,
        };
    }
}