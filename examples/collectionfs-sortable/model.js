Images = new FS.Collection("images", {
    stores: [
        new FS.Store.GridFS("original")
    ],
    filter: {
        allow: {
            contentTypes: ['image/*']
        }
    }
});