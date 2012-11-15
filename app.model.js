(function(){

    function model() {
        this.couchDB = 'http://106.187.36.132:4242/profero';

        this.addDocument = function(data, onload) {
            var that = this;
            return app.xhr({
                url: that.couchDB,
                data: JSON.stringify(data),
                method: 'POST',
                eventListener: {
                    load: onload
                }
            })
        }

        this.addAttachment = function(doc, file, onload) {
            var url = this.couchDB+'/'+doc.id+'/'+file.name+'?rev='+doc.rev;
            return app.xhr({
                url: url,
                data: file,
                method: 'PUT',
                eventListener: {
                    'load': onload
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