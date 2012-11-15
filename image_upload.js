$(function() {

    // get issue information from current url address
    var pathNameSplit = window.location.pathname.split('/');
    var URLComponent = {
        'user': pathNameSplit[1],
        'project': pathNameSplit[2],
        'issue': pathNameSplit[3]
    }

    // append image upload elements on issue creating page
    var imageUploadHtml = '<h3>Add Image</h3><div id="issue-new-drop-zone" class="drop-zone"></div><span class="drop-zone-prompt">Drag image here.<span>';
    var sideBar = $('.column.sidebar');
    $(sideBar).append(imageUploadHtml);

    // listen drop action
    eleDropZone = document.getElementById('issue-new-drop-zone');
    eleDropZone.addEventListener('dragenter', dragenterEvent);
    eleDropZone.addEventListener('dragleave', dragleaveEvent);
    eleDropZone.addEventListener('drop', dropEvent);


    function dragenterEvent(ev) {
        app.view.dropZoneDragEnter();
    }

    function dragleaveEvent(ev) {
        app.view.dropZoneDragLeave();
    }

    // drop event callback
    function dropEvent(ev) {
        ev.preventDefault();
        files = ev.dataTransfer.files;
        if (files.length < 0) {
            return;
        }
        app.file = files[0];
        var fileReader = new FileReader();
        fileReader.onload = function(ev) {
            app.view.hideDropZonePrompt();
            app.view.addImagePreview(ev.target.result);
            app.view.addProgressBar();
            // upload image and insert markdown format url
            app.model.addDocument(URLComponent, function(evLoad) {
                app.model.addAttachment(
                    JSON.parse(this.responseText),
                    app.file,
                    function(evLoad) {
                        var doc = JSON.parse(this.responseText);
                        var imageURL = app.model.couchDB+'/'+doc.id+'/'+app.file.name;
                        app.view.addImageURLOnNewIssue(imageURL, app.file.name);
                        app.view.dropZoneReset();
                    },
                    function(evUploadProgress) {
                        var percent = evUploadProgress.loaded / evUploadProgress.total;
                        app.view.updateProgressBar(Math.round(percent*100));
                    },
                    function(evUploadLoad) {}
                )
            });
        }
        fileReader.readAsDataURL(app.file);
    }

})