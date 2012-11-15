(function(){

    function view() {

        this.dropZoneID = 'issue-new-drop-zone';

        this.addImageURLOnNewIssue = function(url, name) {
            $("#issue_body").get(0).value += "\n"+"!["+name+"]("+url+")";
        }

        this.addImagePreview = function(imgDataURL) {
            $('#'+this.dropZoneID).append('<img class="drop-zone-img-preview" src="'+imgDataURL+'">');
        }

        this.addProgressBar = function() {
            var progressBarHtml = '<div class="progress drop-zone-upload-progress-bar"><div class="bar" style="width: 0;"></div></div>';
            $('#'+this.dropZoneID).append(progressBarHtml);
        }

        this.updateProgressBar = function(percentage) {
            $('.drop-zone-upload-progress-bar .bar').css('width', percentage+'%');
        }

        this.displayDropZonePrompt = function() {
            $('.drop-zone-prompt').css('display', 'block');
        }

        this.hideDropZonePrompt = function() {
            $('.drop-zone-prompt').css('display', 'none');
        }

        this.dropZoneDragEnter = function() {
            $('#'+this.dropZoneID).addClass('drop-zone-drag-over');
            $('.drop-zone-prompt').html('Drop the image.');
        }

        this.dropZoneDragLeave = function() {
            $('#'+this.dropZoneID).removeClass('drop-zone-drag-over');
            $('.drop-zone-prompt').html('Drag image here.');
        }

        this.dropZoneReset = function() {
            $('#'+this.dropZoneID).empty();
            this.displayDropZonePrompt();
            this.dropZoneDragLeave();
        }

    }

    view.prototype = {}

    window.app.view = new view();

})();