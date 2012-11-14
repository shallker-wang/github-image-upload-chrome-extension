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
			fileUpload(files[0]);
		}
	}

	// create a document on couchDB
	function fileUpload(file) {
		app.file = file;
		var host = 'http://106.187.36.132:4242/profero';
		var doc = app.post(host, URLComponent, 'json');
		if (doc) {
			sendStandaloneAttachment(host, doc);
		}
	}

	// send the image as an attachment to the document
	function sendStandaloneAttachment(host, doc) {
		var attchHost = host+'/'+doc.id+'/'+app.file.name+'?rev='+doc.rev;
		var response = app.put(attchHost, app.file, 'binary', 
			{'Content-type': app.file.type});
		if (response) {
			var imageURL = host+'/'+doc.id+'/'+app.file.name;
			insertImageURL(imageURL);
		}
	}

	// insert markdown format image to the current textarea
	function insertImageURL(url) {
		var content = $('#issue_body').val();
		content += "\n"+"!["+app.file.name+"]("+url+")";
		$('#issue_body').val(content);
	}


})