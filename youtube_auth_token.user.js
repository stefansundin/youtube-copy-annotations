// ==UserScript==
// @name           YouTube auth_token
// @namespace      http://stefansundin.com/
// @description    Displays the auth_token and a download link for annotations
// @include        http://www.youtube.com/my_videos_annotate?*
// @include        http://www.youtube.com/my_videos*
// ==/UserScript==

(function() {
	// Get url
	var url = window.location.toString();
	if (url.lastIndexOf("?") != -1) {
		url = url.substring(0, url.lastIndexOf("?"));
	}

	if (url == "http://www.youtube.com/my_videos") {
		// List of my videos
		var ids = [];

		var pagination = document.getElementById("vm-pagination");
		pagination.parentNode.insertBefore(document.createTextNode("video_id:auth_token pairs of videos above:"), pagination);
		pagination.parentNode.insertBefore(document.createElement("br"), pagination);

		var ta = document.createElement("textarea");
		ta.style.width = "100%";
		ta.rows = 25;
		ta.spellcheck = false;
		pagination.parentNode.insertBefore(ta, pagination);

		// Get ids
		var videos = document.getElementsByClassName("vm-video-item");
		for (var i=0; i < videos.length; i++) {
			var id = videos[i].id;
			ids.push(id.substring("vm-video-".length));
		}

		// Make requests
		ids.forEach(function(id) {
			GM_xmlhttpRequest({
				method: "GET",
				url: "http://www.youtube.com/my_videos_annotate?v="+id,
				onload: function (response) {
					var video_id = response.finalUrl.substring(response.finalUrl.indexOf("?v=")+"?v=".length);

					// Get auth_token
					var ret = /SWF_ARGS.*?:.*?{.*?auth_token.*?:.*?"(.*?)"/.exec(response.responseText);
					if (ret == null) {
						ta.value += "ERROR "+video_id+"\n";
						return;
					}
					var auth_token = ret[1];

					// Get title
					var title;
					try {
						title = document.getElementById("vm-video-"+video_id).getElementsByClassName("vm-video-title")[0].getElementsByClassName("vm-video-title-content")[0].textContent;
					}
					catch (e) {
						title = "Error getting title";
					}

					// Print in textarea
					ta.value += video_id+":"+auth_token+" "+title+"\n";
				}
			});
		});
	}
	else {
		// Annotations page
		var username = unsafeWindow.yt.getConfig("SWF_ARGS")["creator"];
		var video_id = unsafeWindow.yt.getConfig("SWF_ARGS")["video_id"];
		var auth_token = unsafeWindow.yt.getConfig("SWF_ARGS")["auth_token"];
		var footer = document.getElementsByClassName("learn-annotations")[0];
		var input = document.createElement("input");
		input.type = "text";
		input.style.cssFloat = "right";
		input.style.width = "500px";
		input.value = video_id+":"+auth_token;
		input.addEventListener("focus", function() {
			input.select();
		}, false);
		footer.appendChild(input);
		var dllink = document.createElement("a");
		dllink.href = "http://www.youtube.com/annotations_auth/read2?video_id="+video_id+"&username="+username+"&auth_token="+auth_token+"&owner=1&timestamp=&draft=1";
		dllink.target = "_blank";
		dllink.style.cssFloat = "right";
		dllink.style.marginRight = "10px";
		dllink.appendChild(document.createTextNode("Download annotations!"));
		footer.appendChild(dllink);
	}
})();
