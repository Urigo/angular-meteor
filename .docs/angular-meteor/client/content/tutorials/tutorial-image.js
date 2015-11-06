UI.registerHelper('tutorialImage', function(tutorialName, fileName, height, width){
  return Spacebars.SafeString('<img style="border: 1px gainsboro solid; display: block; margin: 5px; height: auto; width: auto; max-height: ' + height + 'px; max-width: ' + width + 'px;" src="/tutorials-images/' + tutorialName + '/' + fileName + '" />');
});
