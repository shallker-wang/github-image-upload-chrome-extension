$(function() {

	// get issue information from current url address
	var pathNameSplit = window.location.pathname.split('/');
	var URLComponent = {
		'user': pathNameSplit[1],
		'project': pathNameSplit[2],
		'issue': pathNameSplit[3]
	}

	// append image upload elements on issue creating page
	var imageUploadHtml = '<h3>Add Image</h3><div id="issue-image-upload" class="drag-drop"><h4>Drag image here.<h4></div>';
	var sideBar = $('.column.sidebar');
	$(sideBar).append(imageUploadHtml);

	// listen drop action
	var dragDrop = document.getElementById('issue-image-upload');
	dragDrop.addEventListener('drop', dropEvent);

	// drop event callback
	function dropEvent(ev) {
		ev.preventDefault();
		files = ev.dataTransfer.files;
		if (files.length > 0) {
			file_upload(files[0]);
		}
	}

	// upload file to the server
	function file_upload(file) {
		app.file = file;
		var host = 'http://106.187.36.132:4242/profero';
		var couchDocument = URLComponent;
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 201)) {
				sendStandaloneAttachment(JSON.parse(xhr.responseText));
			}
		}
		xhr.open('POST', host);
		xhr.send(JSON.stringify(couchDocument));

		function sendStandaloneAttachment(documentInfo) {
			var attachHost = host+'/'+documentInfo.id+'/'+app.file.name+'?rev='+documentInfo.rev;
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 201)) {
					var imageURL = host+'/'+documentInfo.id+'/'+app.file.name;
					insertImageURL(imageURL);
				}
			}
			xhr.open('PUT', attachHost);
			xhr.setRequestHeader('Content-type', app.file.type);
			xhr.send(app.file);
		}

		function insertImageURL(url) {
			var content = $('#issue_body').val();
			content += "\n"+"!["+app.file.name+"]("+url+")";
			$('#issue_body').val(content);
		}

	}


})