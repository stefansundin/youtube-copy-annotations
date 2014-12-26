// ==UserScript==
// @name         YouTube auth_token
// @namespace    https://gist.github.com/stefansundin/
// @homepage     https://github.com/stefansundin/youtube-copy-annotations/
// @version      0.6
// @author       Stefan Sundin
// @description  Displays the auth_token and adds a download link for annotations.
// @icon         https://www.youtube.com/favicon.ico
// @match        *://www.youtube.com/my_videos*
// @match        *://www.youtube.com/my_videos_annotate*
// @downloadURL  https://github.com/stefansundin/youtube-copy-annotations/raw/gh-pages/youtube_auth_token.user.js
// ==/UserScript==

if (window.location.pathname == '/my_videos') {
  // Get page number
  var pi = 1;
  var ret = /pi=(\d+)/.exec(window.location.search);
  if (ret != null) {
    pi = parseInt(ret[1], 10);
  }

  // List of my videos
  var ta = document.createElement('textarea');
  ta.style.width = '90%';
  ta.style.fontFamily = 'monospace';
  ta.style.display = 'block';
  ta.style.margin = '0 auto';
  ta.rows = 34;
  ta.spellcheck = false;
  ta.value = '# My videos (page '+pi+')\n# Please save this list in a text file in case this script stops working with future YouTube updates.\n';
  ta.addEventListener('focus', function() {
    setTimeout(function() {
      ta.select();
    }, 100);
  }, false);
  document.getElementById('creator-page-content').appendChild(ta);

  // Get ids
  var timer = null;
  timer = setInterval(function() {
    var videos = document.getElementsByClassName('vm-video-item');
    for (var i=0; i < videos.length; i++) {
      var video_id = videos[i].id.substring('vm-video-'.length);
      var title = videos[i].getElementsByClassName('vm-video-title-content')[0].textContent;
      ta.value += video_id+'   # '+title;

      // Check if unlisted
      var unlisted = videos[i].getElementsByClassName('vm-unlisted');
      if (unlisted.length > 0 && unlisted[0].className.indexOf('hid') == -1) {
        ta.value += ' (unlisted)';
      }

      // Check if private
      var priv = videos[i].getElementsByClassName('vm-priv');
      if (priv.length > 0 && priv[0].className.indexOf('hid') == -1) {
        ta.value += ' (private)';
      }

      ta.value += '\n';
    }
    if (videos.length > 0) {
      clearInterval(timer);
    }
  }, 100);
}
else {
  // Annotations page
  // Get auth_token
  var ret = /auth_token.*?:.*?"(.*?)"/.exec(document.body.innerHTML);
  if (ret == null) return;
  var auth_token = ret[1];

  // Create container
  var right = document.createElement('div');
  right.style.cssFloat = 'right';
  document.getElementsByClassName('learn-annotations')[0].appendChild(right);

  // Print auth_token
  right.appendChild(document.createTextNode('Auth token: '));
  var input = document.createElement('input');
  input.type = 'text';
  input.style.width = '450px';
  input.style.fontFamily = 'monospace';
  input.value = auth_token;
  input.addEventListener('focus', function() {
    setTimeout(function() {
      input.select();
    }, 100);
  }, false);
  right.appendChild(input);

  // Create download link
  var ret = /[\?&]v=([^&]+)/.exec(window.location.search); // extract id from url
  if (ret != null) {
    var link = document.createElement('a');
    link.href = '/annotations_auth/read2?video_id='+ret[1]+'&auth_token='+auth_token+'&draft=1';
    link.target = '_blank';
    link.appendChild(document.createTextNode('Download annotations!'));
    right.appendChild(document.createTextNode(' '));
    right.appendChild(link);
  }
}
