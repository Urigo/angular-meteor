Images = new FS.Collection("images", {
    stores: [
        new FS.Store.GridFS("original"),
        new FS.Store.GridFS("thumbnail", {
            transformWrite: function(fileObj, readStream, writeStream) {
                gm(readStream, fileObj.name()).resize('32', '32', '!').stream().pipe(writeStream);
            }
        })
    ],
    filter: {
        allow: {
            contentTypes: ['image/*']
        }
    }
});