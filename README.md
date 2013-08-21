ngMeteor
========

### Usage
To prevent conflicts with Handlebars, AngularJS data-bindings should look like this:

    [[some data]]
    
instead of this:

    {{some data}}
    
For example:

    <div>
      <label>Name:</label>
      <input type="text" ng-model="yourName" placeholder="Enter a name here">
      <hr>
      <h1>Hello [[yourName]]!</h1>
    </div>
