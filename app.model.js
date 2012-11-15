(function(){

    function model() {
        this.couchDB = 'http://106.187.36.132:4242/profero';

        this.addDocument = function(data, complete) {
            var that = this;
            return app.xhr({
                url: that.couchDB,
                data: JSON.stringify(data),
                method: 'POST',
                eventListener: {
                    load: complete
                }
            })
        }

        this.addAttachment = function(doc, file, complete, uploadProgress, uploadComplete) {
            var url = this.couchDB+'/'+doc.id+'/'+file.name+'?rev='+doc.rev;
            return app.xhr({
                url: url,
                data: file,
                method: 'PUT',
                eventListener: {
                    'load': complete
                },
                uploadEventListener: {
                    'progress': uploadProgress,
                    'load': uploadComplete
                },
                header: {
                    'Content-type': file.type
                }
            })
        }
    }

    model.prototype = {}

    window.app.model = new model();

})();