$(document).ready(function() {
  console.log('composer-char-counter.js is loaded and DOM is ready.');

  // Initiating the counter
  let $counter = $('.new-tweet .counter');

  // Event handler for the textarea
  $('.new-tweet textarea').on('input', function() {
    let textAreaInput = $(this).val();
    let textLength = textAreaInput.length;
    let charactersLeft = 140 - textLength;
    console.log('Characters left: ', charactersLeft);

    $counter.text(charactersLeft);

    if (charactersLeft < 0) {
      $counter.addClass('invalid');
    } else {
      $counter.removeClass('invalid');
    }
  });
});