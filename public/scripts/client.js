/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  // Event listener for form submission
  $('.new-tweet form').on('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Serialize the form data
    const $textarea = $(this).find('textarea');
    const tweetText = $textarea.val();
    const tweetLength = tweetText.length;

    // Validation check
    if (tweetLength === 0 || tweetLength > 140) {
      alert("Tweet should be between 1 and 140 characters.");
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
      },
      error: function(err) {
        console.error('Error posting tweet:', err);
      }
    });
  });

  // Function to create a tweet element
  const createTweetElement = function(tweet) {
    const { user, content, created_at } = tweet;

    const formattedTime = timeago.format(new Date(created_at));

    const $tweet = $(`
      <article class="tweet">
        <header>
          <img src="${user.avatars}" alt="User Avatar" class="avatar">
          <h2 class="username">${user.name}</h2>
          <span class="handle">${user.handle}</span>
        </header>
        <div class="tweet-content">
          ${content.text}
        </div>
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
