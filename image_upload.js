$(function() {

	// get issue information from current url address
	var pathNameSplit = window.location.pathname.split('/');
	var URLComponent = {
		'user': pathNameSplit[1],
		'project': pathNameSplit[2],
		'issue': pathNameSplit[3]
	}

	// append image upload elements on issue creating page
	var imageUploadHtml = '<h3>Add Image</h3><div id="issue-image-upload" class="drag-drop"></div><span class="drag-prompt">Drag image here.<span>';
	var sideBar = $('.column.sidebar');
	$(sideBar).append(imageUploadHtml);

	// listen drop action
	eleDropZone = document.getElementById('issue-image-upload');
	eleDropZone.addEventListener('dragenter', dragenterEvent)
	eleDropZone.addEventListener('dragleave', dragleaveEvent)
	eleDropZone.addEventListener('drop', dropEvent);


	function dragenterEvent(ev) {
		$(eleDropZone).addClass('drag-over');
		$('.drag-prompt').html('Drop the image.');
	}
	function dragleaveEvent(ev) {
		$(eleDropZone).removeClass('drag-over');
		$('.drag-prompt').html('Drag image here.');
	}

	// drop event callback
	function dropEvent(ev) {
		ev.preventDefault();
		files = ev.dataTransfer.files;
		if (files.length > 0) {
			fileUpload(files[0]);
		}
		dragleaveEvent();
	}

	// upload image and insert markdown format url
	function fileUpload(file) {
		app.file = file;
		app.model.addDocument(URLComponent, function(ev) {
			app.model.addAttachment(JSON.parse(this.responseText), app.file, function(ev) {
				var doc = JSON.parse(this.responseText);
				var imageURL = app.model.couchDB+'/'+doc.id+'/'+app.file.name;
				app.view.addImageURLOnNewIssue(imageURL, app.file.name);
			})
		});
	}

})