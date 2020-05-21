
export class Product {
    constructor(x) {
        this.name = x.name;
        this.uuid = x.uuid;
        this.isActive = x.isActive;
        this.images = x.images;
        this.timestampAdded = x.timestampAdded;
    }

    static fromFirestore(doc) {
        const data = doc.data();

        if (!data) return null;

        return new Product({
            name: data['name'] ?? '',
            uuid: doc.id,
            isActive: data['isActive'] ?? false,
            images: data['images'] ?? [],
            timestampAdded: new Date(),
        });
    }

    toJson(x) {
        return {
            name: x.name,
            uuid: x.uuid,
            isActive: x.isActive,
            images: x.images,
            timestampAdded: x.timestampAdded,
        };
    }
}