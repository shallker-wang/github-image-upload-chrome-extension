(function(){

    function view() {

        this.addImageURLOnNewIssue = function(url, name) {
            $('body').append('<img class="img-preload" src="'+url+'">');
            $("#issue_body").get(0).value += "\n"+"!["+name+"]("+url+")";
        }

        this.addImageURLOnClosedTextarea = function(url, name) {
            $('body').append('<img class="img-preload" src="'+url+'">');
            $(app.eleDropZone).parent().parent().find('textarea').get(0).value += "\n"+"!["+name+"]("+url+")";
        }


        this.addImagePreview = function(imgDataURL) {
            $(app.eleDropZone).append('<img class="drop-zone-img-preview" src="'+imgDataURL+'">');
        }

        this.addProgressBar = function() {
            var progressBarHtml = '<div class="progress drop-zone-upload-progress-bar"><div class="bar" style="width: 0;"></div></div>';
            $(app.eleDropZone).append(progressBarHtml);
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

        this.dropZoneDragEnter = function(dropZone) {
            $(dropZone).addClass('drop-zone-drag-over');
            $(dropZone).siblings().filter('.drop-zone-prompt').html('Drop the image.');
        }

        this.dropZoneDragLeave = function(dropZone) {
            $(dropZone).removeClass('drop-zone-drag-over');
            $(dropZone).siblings().filter('.drop-zone-prompt').html('Drag image here.');
        }

        this.dropZoneReset = function() {
            $(app.eleDropZone).empty();
            this.displayDropZonePrompt(app.eleDropZone);
            this.dropZoneDragLeave(app.eleDropZone);
        }

    }

    view.prototype = {}

    window.app.view = new view();

})();