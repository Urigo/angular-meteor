{{#template name="tutorials.socially.angular1.step_20.md"}}
{{> downloadPreviousStep stepName="step_19"}}

In this step we are going to add the ability to upload images into our app, and also sorting and naming them.

Angular-Meteor can use Meteor [CollectionFS](https://github.com/CollectionFS/Meteor-CollectionFS) which is a suite of Meteor packages that together provide a complete file management solution including uploading, downloading, storage, synchronization, manipulation, and copying.

It supports several storage adapters for saving files to the local filesystem, GridFS, Amazon S3, or DropBox,  and additional storage adapters can be created.

The process is very similar for handling any other MongoDB Collection!

So let's add image upload to our app!


We will start by adding CollectionFS to our project, by running the following command:

    $ meteor add cfs:standard-packages

Now, we will decide the storage adapter we want to use. 
In this example, we will use the GridFS as storage adapters, so we will add the adapter by running this command:

    $ meteor add cfs:gridfs

Note: you can find more information about Stores and Storage Adapters on the [CollectionFS](https://github.com/CollectionFS/Meteor-CollectionFS)'s GitHub repository.

So now we have the CollectionFS support and the storage adapter installed - we still need to create a CollectionFS object to handle our files.
Note that you will need to define the collection as shared resource because you will need to use the collection in both client and server side.

### Creating the CollectionFS

Let's start by creating `model/images.js` file, and define a regular CollectionFS object called "Images".
Also we will use the CollectionFS API that allows us to defined auth-rules.
Finally, We will publish the collection just like any other collection, in order to allow the client to subscribe to those images:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.3"}}

Now let's add a regular subscription to the `images` publication, and also add the `Images` collection as helper:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.4"}}

So now we have the collection, We can now create a client-side that handles the images upload.

### Image Upload

Note that for file upload you can use basic HTML `<input type="file">`  or any other package - you only need the HTML5 File object to be provided.

For our application, we would like to add ability to drag-and-drop images, so we use AngularJS directive that handles file upload and gives us more abilities such as drag & drop, file validation on the client side.
In this example, I will use [ng-file-upload](https://github.com/danialfarid/ng-file-upload), which have many features for file upload.
In order to do this, lets add the package to our project:

    $ meteor add danialfarid:ng-file-upload

Now, lets add a dependency in the `app.js` file:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.6"}}

Now, let's add the usage of `ng-file-upload` to the add new party modal:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.7"}}

And now let's add some CSS rules to make the upload box look better, and it also create an area for drag & drop:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.8"}}

And of course, let's import this file:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.9"}}

And now let's add the `addImages` method to our component:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.10"}}

> Note that the `addImages` is used in `nfg-change` attribute on html file we just created.

And that's it! now we can upload images by using drag and drop!
Just note that the Application UI still don't show the new images we upload... we will add this later.
Now let's add some more cool features, And make the image uploaded image visible!

### Image Crop

One of the most common actions we want to make with pictures is edit them before saving. 
We will add to our example ability to crop images before uploading them to the server, using [ngImgCrop](https://github.com/alexk111/ngImgCrop/) package.
So lets start by adding the package to our project:

    $ meteor add alexk111:ng-img-crop

And add a dependency in our module:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.12"}}

We want to perform the crop on the client, before saving it to the `CollectionFS`, so lets get the uploaded image, and instead of saving it to the server - we will get the Data Url of it, and use it in the `ngImgCrop`:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.15"}}

We took the file object and used HTML5 FileReader API to read the file from the user on the client side, without uploading it to the server.
Then we saved the DataURI of the image into a variable.
Next, we will need to use this DataURI with the `ngImgCrop` directive as follow:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.13"}}

>Moreover we add `ng-hide` to the upload control, in order to hide it, after the user picks an image to crop.

And add some CSS to make it look better:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.14"}}

And let's add a button that saves the new cropped image.

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.16"}}

In order to save, we need to implement `saveCroppedImage()` function. We will use the same `CollectionFS` API we used before - with the `insert` method.

CollectionFS have the ability to receive DataURI and save it, just like a File object. So the implementation looks like that:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.17"}}

So we take the image object and save it to the CollectionFS and put it in an array we called `images` that will hold the images for the new party.

Then we reset the form by updating the value of `cropImgSrc` variable (we used it in the `ng-hide`).

We also change the login under `addNewParty` method, we take only the `_id` property of the images, because we want to save the id and not the whole image object when saving it.

And we are almost done, Now we have the ability to crop images and then save them using CollectionFS.

We are just missing the display of the uploaded images in our form!

### Display Uploaded Images

Let's add a simple gallery to list the images in the new party form:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.18"}}

And that's it! We just repeated them and used it built-in method called `.url()`!

Now let's add description to our images!

### Images Metadata & Description

Using CollectionFS, we can also save metadata on the files we store.
In order to do that, we just need to update the `metadata` property of the image object.

In order to do that with really nice and user-friendly ui, I used [angular-xeditable](https://github.com/vitalets/angular-xeditable).
Lets add the angular-xeditable package to our project:

    $ meteor add vitalets:angular-xeditable

And add a dependency in our module:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.20"}}

Now, let's use `angular-xeditable` and add usage under the image:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.21"}}

Due to problem with open issue in [angular-xeditable](https://github.com/vitalets/angular-xeditable/issues/6) 
We need to change the `form` on `add-new-party-modal.html` into `div` to make the inline editing of `angular-xeditable` work.

And, of course, implement `updateDescription` function on the parties list scope:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.22"}}

> We used the CollectionFS API again, using the `update()` method, and we put the description under the `metadata.description` property.

That's it! Now we have a photo gallery with description for each image!

### Sort Images

After we learned how to use CollectionFS metadata and how to update metadata values, we can also add an ability to sort and update the images order.
To get the ability to sort the images, let's use [angular-sortable-view](https://github.com/kamilkp/angular-sortable-view).

Add the package by running this command:

    $ meteor add netanelgilad:angular-sortable-view

And then add a dependency for the module:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.24"}}

The basics of `angular-sortable-view` is to add the `sv-?` attributes to our page, just like the examples in the `angular-sortable-view` repository, So let's do that:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.25"}}

> We also added `draggable="false"` to prevent the browser's default behavior for dragging images.

We can also add a highlight to the first image, which we will use as the main image, by adding an indication for that:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.26"}}

And some CSS to make it look better:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.27"}}

So now we have image gallery with ability to add images, edit them, add a description and sort.
Now we just need to add the logic that connect those images with the party we are creating!

### Link Image To Object

So as you know, we have all the images stored in `newParty.images` array, and we changed `addNewParty` method in step 20.17 to save only the ids of the images.

So finally, to display the main image in the parties list, add the following code to the component:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.29"}}

And implement the `getMainImage` function:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.28"}}

With some CSS rules to make it look better:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.30"}}

And that's it!

### Thumbnails

Another common usage with image upload, is the ability to save thumbnails of the image as soon as we upload it.
CollectionFS gives the ability to handle multiple Stores object, and perform manipulations before we save it in each store.
You can find the full information about image manipulation in the [CollectionFS docs](https://github.com/CollectionFS/Meteor-CollectionFS#image-manipulation).

Also, make sure you add graphicsmagick package by inserting the following line in the terminal :

    $ meteor add cfs:graphicsmagick

For more information, follow the instructions on the [CollectionFS](https://github.com/CollectionFS/Meteor-CollectionFS) GitHub page.
In order to add ability to save thumbnails, lets add a new store in the `images.js` modal and use `transformWrite` ability:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.31"}}

So now each image we upload will be saved also as thumbnail.
All we have to do in order to display the thumbnail instead of the original image is to add a param to `url()` method of File objects and decide which Store to use when creating the URL:

{{> DiffBox tutorialName="meteor-angular1-socially" step="20.32"}}

That's it! Now we added the ability to save thumbnails for the images and use them in the view!

{{/template}}
