$(function() {

    if (window.location.pathname.indexOf('new') == -1) {
        return;
    }
    // console.log('issue_new.js');

    // get issue information from current url address
    var pathNameSplit = window.location.pathname.split('/');
    var URLComponent = {
        'user': pathNameSplit[1],
        'project': pathNameSplit[2],
        'issue': pathNameSplit[3]
    }

    // append image upload elements on issue creating page
    var imageUploadHtml = '<div class="drop-zone-wrapper"><h3>Add Image</h3><div id="issue-new-drop-zone" class="drop-zone"></div><span class="drop-zone-prompt">Drag image here.<span></div>';
    var sideBar = $('.column.sidebar');
    $(sideBar).append(imageUploadHtml);

    // listen drop action
    eleDropZone = document.getElementById('issue-new-drop-zone');
    eleDropZone.addEventListener('dragenter', dragenterEvent);
    eleDropZone.addEventListener('dragleave', dragleaveEvent);
    eleDropZone.addEventListener('drop', dropEvent);


    function dragenterEvent(ev) {
        app.view.dropZoneDragEnter(ev.target);
    }

    function dragleaveEvent(ev) {
        app.view.dropZoneDragLeave(ev.target);
    }


    // drop event callback
    function dropEvent(ev) {
        app.eleDropZone = ev.target;
        ev.preventDefault();
        var files = ev.dataTransfer.files;
        app.files = [];
        for (var i=0; i<files.length; i++) {
            app.files.push(files[i]);
        }
        app.filesUpload();
    }

    app.filesUpload = function() {
        if (app.files.length < 1) {
            return;
        }
        readAndUpload(app.files.shift());
    }
    
    function readAndUpload(file) {
        app.file = file;
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
                        app.filesUpload();
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