$(function() {
    if (window.location.pathname.indexOf('new') != -1) {
        return;
    }
    // console.log('issue_edit_comment.js')

    // get issue information from current url address
    var pathNameSplit = window.location.pathname.split('/');
    var URLComponent = {
        'user': pathNameSplit[1],
        'project': pathNameSplit[2],
        'issue': pathNameSplit[3]
    }

    var dropZoneHtml = '<div class="drop-zone-wrapper drop-zone-issue-edit"><div class="drop-zone"></div><span class="drop-zone-prompt">Drag image here.<span></div>';

    listenIssueTopic();
    function listenIssueTopic() {
        var issueNodeList = document.getElementsByClassName('discussion-bubble');
        issueNodeList.item(0).addEventListener('click', function(ev) {
            // issue edit
            if ($(ev.srcElement).hasClass('js-comment-edit-button')) {
                $('.discussion-sidebar').hide();
                $(this).prepend(dropZoneHtml);
            }
            // issue edit cancel
            if ($(ev.srcElement).hasClass('js-comment-cancel-button')) {
                $(this).find('.drop-zone-wrapper').remove();
                $('.discussion-sidebar').show();
            }
        })
        
    }

    listenIssueComments();
    function listenIssueComments() {
        var issueNodeList = document.getElementsByClassName('discussion-bubble');
        for (var i=1; i<issueNodeList.length-1; i++) {
            var comment = issueNodeList.item(i);
            if ($(comment).hasClass('issue-comment-listened')) {
                continue;
            }
            comment.addEventListener('click', function(ev) {
                // issue comment edit
                if ($(ev.srcElement).hasClass('js-comment-edit-button')) {
                    $(this).prepend(dropZoneHtml);
                }
                // issue commment edit cancel
                if ($(ev.srcElement).hasClass('js-comment-cancel-button')) {
                    $(this).find('.drop-zone-wrapper').remove();
                }
                // issue comment edit update
                if (ev.srcElement.tagName == 'BUTTON' && ev.srcElement.type == 'submit') {
                    $(this).find('.drop-zone-wrapper').remove();
                }
            })
            $(comment).addClass('issue-comment-listened');
        }
    }

    listenIssueCommentNew();
    function listenIssueCommentNew() {
        var issueNodeList = document.getElementsByClassName('discussion-bubble');
        $(issueNodeList).last().prepend(dropZoneHtml);
        issueNodeList.item(issueNodeList.length-1).addEventListener('click', function(ev) {
            if (ev.srcElement.type == 'submit') {
                setTimeout(listenIssueComments, 1000);
            }
        });
    }

    $(document).delegate('.drop-zone', 'dragenter', dragenterEvent);
    $(document).delegate('.drop-zone', 'dragleave', dragleaveEvent);
    document.addEventListener('drop', function(ev) {
        ev.preventDefault();
        var files = ev.dataTransfer.files;
        if ($(ev.srcElement).hasClass('drop-zone')) {
            app.eleDropZone = ev.srcElement;
            app.files = [];
            for (var i=0; i<files.length; i++) {
                app.files.push(files[i]);
            }
            app.filesUpload();
        }
    })


    function dragenterEvent(ev) {
        app.view.dropZoneDragEnter(ev.srcElement);
    }

    function dragleaveEvent(ev) {
        app.view.dropZoneDragLeave(ev.srcElement);
    }

    app.filesUpload = function() {
        if (app.files.length < 1) {
            return;
        }
        readAndUpload(app.files.shift());
    }
    
    function readAndUpload(file) {
        app.file = file;
        app.fileNameMd5 = hex_md5(file.name)+'.'+file.name.split('.').pop();
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
                        var imageURL = app.model.couchDB+'/'+doc.id+'/'+app.fileNameMd5;
                        app.view.addImageURLOnClosedTextarea(imageURL, app.file.name);
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
