$(function() {
	window.app = {};
	app.host = 'http://106.187.36.132:4242/profero';

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
	dragDrop.addEventListener('drop', drop);

	// drop event callback
	function drop(ev) {
		ev.preventDefault();
		files = ev.dataTransfer.files;
		if (files.length > 0) {
			file_upload(files[0]);
		}
		console.log(files);
	}

	// upload file to the server
	function file_upload(file) {
		app.file = file;
        var fileReader = new FileReader();
        fileReader.onload = function(ev) {
        	// console.log(ev);
        	// return;
        	// console.log(app);
        	// return;
        	var fileLength = ev.loaded || ev.total;
        	var timestamp = ev.timeStamp;
        	var binaryString = ev.target.result;
        	var randomId = Math.round(Math.random()*10000000000000);
        	var fileName = app.file.name;
        	var fileType = app.file.type;
	        var data = {
	        	'_id': randomId+fileName,
	        	'_attachments': {
	        		'newfile': {
	        			"content_type": "image\/png",
	        			"data": Base64.encode(binaryString)
	        		}
	        	}
	        }
	        var couchData = JSON.stringify(data);
			var ajax = new XMLHttpRequest();
			var host = 'http://106.187.36.132:4242/profero';
			ajax.open("POST", host, true);
	        ajax.send(couchData);
        }
        fileReader.readAsBinaryString(file);
	}


})