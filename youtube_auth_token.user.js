// ==UserScript==
// @name           YouTube auth_token
// @namespace      http://stefansundin.com/
// @description    Displays the auth_token and a download link for annotations
// @icon           http://www.youtube.com/favicon.ico
// @include        http://www.youtube.com/my_videos_annotate?*
// @include        http://www.youtube.com/my_videos*
// @include        https://www.youtube.com/my_videos_annotate?*
// @include        https://www.youtube.com/my_videos*
// @grant          none
// ==/UserScript==


(function() {
	if (window.location.pathname == '/my_videos') {
		// List of my videos
		var ta = document.createElement('textarea');
		ta.style.width = '90%';
		ta.style.fontFamily = 'monospace';
		ta.style.display = 'block';
		ta.style.margin = '0 auto';
		ta.rows = 15;
		ta.spellcheck = false;
		ta.value = '#My videos\n';
		ta.addEventListener('focus', function() {
			setTimeout(function() {
				ta.select();
			}, 100);
		}, false);

		var pagination = document.getElementById('vm-pagination');
		pagination.parentNode.insertBefore(ta, pagination);

		// Get ids
		var videos = document.getElementsByClassName('vm-video-item');
		for (var i=0; i < videos.length; i++) {
			var video_id = videos[i].id.substring('vm-video-'.length);
			var title = videos[i].getElementsByClassName('vm-video-title-content')[0].textContent;
			ta.value += video_id+' #'+title+'\n';
		}
	}
	else {
		// Annotations page
		// Get auth_token
		var ret = /auth_token.*?:.*?"(.*?)"/.exec(document.body.innerHTML);
		if (ret == null) {
			return;
		}
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
			link.href = 'http://www.youtube.com/annotations_auth/read2?video_id='+ret[1]+'&auth_token='+auth_token+'&draft=1';
			link.target = '_blank';
			link.appendChild(document.createTextNode('Download annotations!'));
			right.appendChild(document.createTextNode(' '));
			right.appendChild(link);
		}
	}
})();
