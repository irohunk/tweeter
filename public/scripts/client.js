/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  // Function to validate tweet text
  const isTweetValid = function(tweetText) {
    const trimmedText = tweetText.trim();
    if (trimmedText.length === 0) {
      displayError("Tweet cannot be empty.");
      return false; // Invalid tweet
    }
    if (trimmedText.length > 140) {
      displayError("Please limit your tweet to 140 characters.");
      return false; // Invalid tweet
    }
    return true; // Valid tweet
  };

  const displayError = function(message) {
    const $errorMessage = $('.error-message');
    $errorMessage.text(message);
    $errorMessage.slideDown();
  };

  // Hide error messages
  const hideError = function() {
    const $errorMessage = $('.error-message');
    $errorMessage.slideUp();
  }

  // Event listener for form submission
  $('.new-tweet form').on('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Hide error message before validation
    hideError();

    // Get the tweet text
    const $textarea = $(this).find('textarea');
    const tweetText = $textarea.val();

    if(!isTweetValid(tweetText)) {
      return;
    }

    // Serialize the form data if validation passes
    const tweetData = $(this).serialize();
    console.log("Tweet being sent to server: ", tweetData);

    // Send the form data using AJAX
    $.ajax({
      url: '/tweets', // Endpoint to send the form data
      method: 'POST',
      data: tweetData,
      success: function(response) {
        console.log("Server response: ", response)
        // On successful response, fetch the new tweets and render them
        loadTweets();
        $textarea.val(''); // Clear the textarea after successful submission
        $textarea.trigger('input'); // Trigger input event to reset the counter
      },
      error: function(err) {
        console.error('Error posting tweet:', err);
      }
    });
  });

  // Function to safely set text content to prevent XSS
  const setSafeText = function($element, text) {
    $element.text(text);
  };

  // Function to create a tweet element
  const createTweetElement = function(tweet) {
    const { user, content, created_at } = tweet;

    // Format the timestamp using timeago
    const formattedTime = timeago.format(new Date(created_at));

    const $tweet = $(`
      <article class="tweet">
        <header>
          <img src="${user.avatars}" alt="User Avatar" class="avatar">
          <h2 class="username"></h2>
          <span class="handle"></span>
        </header>
        <div class="tweet-content"></div>
        <footer>
          <span class="timestamp">${formattedTime}</span>
          <div class="tweet-actions">
            <i class="fas fa-flag"></i>
            <i class="fas fa-retweet"></i>
            <i class="fas fa-heart"></i>
          </div>
        </footer>
      </article>
    `);

    // Use setSafeText to set the text content safely
    setSafeText($tweet.find('.username'), user.name);
    setSafeText($tweet.find('.handle'), user.handle);
    setSafeText($tweet.find('.tweet-content'), content.text);

    return $tweet;
  };

  // Function to render tweets
  const renderTweets = function(tweets) {
    const $tweetsContainer = $('.tweets-container');
    $tweetsContainer.empty(); // Clear the container before appending new tweets

    // Loop through each tweet and append it to the tweets container
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $tweetsContainer.prepend($tweet);
    }
  };

  // Function to load tweets from the server
  const loadTweets = function() {
    $.ajax({
      url: '/tweets',
      method: 'GET',
      success: function(tweets) {
        renderTweets(tweets);
      },
      error: function(err) {
        console.error('Error loading tweets:', err);
      }
    });
  };

  // Initial load of tweets
  loadTweets();
});
