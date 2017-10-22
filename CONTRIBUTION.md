## Style Guide

For the coding style guide, we use AirBnB [rules](https://github.com/airbnb/javascript) with TypeScript specifics and max line width set to 100 symbols. Rules are partly enforced by the tslint.json file in the root (if you are not familiar with TSLint, read more [here](https://github.com/palantir/tslint)). Please, check that your code conforms with the rules before PR.

### Clone the source to your computer

In order to work with this package locally when using Meteor project, follow these instructions:

1. Clone this repository to any folder.
   Note that if you clone into Meteor project directory - you need to put the cloned folder inside a hidden file, so Meteor won't try to
   build it! Just create a folder that starts with `.` under your project root, it should look like that:
   ````
   MyProject
      .local-packages
         angular-meteor
      .meteor
      client
      server
      public
   ````

2. Run your project with enviromental variable `METEOR_PACKAGES_DIR=your_packages_folder` directory under your root.
