/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Test / driver code (temporary). Eventually will get this from the server.


// Define createTweetElement function
const createTweetElement = function(tweet) {
  const { user, content, created_at } = tweet;
  
  // Create the tweet
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
        <span class="timestamp">${new Date(created_at).toLocaleString()}</span>
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

// Define renderTweets function
const renderTweets = function(tweets) {
  const $tweetsContainer = $('.tweets-container');
  $tweetsContainer.empty(); // Clear the container before appending new tweets

  // Loop through each tweet and append it to the tweets container
  for (const tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $tweetsContainer.append($tweet);
  }
};

// Test data
const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png",
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd"
    },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  }
];

// Call renderTweets to render the tweets on page load
$(document).ready(function() {
  renderTweets(data);
});