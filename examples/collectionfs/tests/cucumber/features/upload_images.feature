Feature: Upload Images with CollectionFS

  Uploading files using CollectionFS and the methods available on the $meteorCollection service.

  Background:
    Given I am a new user
    And I am on route "/"

  @dev
  Scenario:
    When I upload a new image
    Then I should see the image in the table
