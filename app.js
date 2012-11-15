(function(){
    function app() {

    }

    app.prototype = {
        redirect: function(url) {
            window.location.href = url;
        }
    }

    app.prototype.xhr = function(para) {
        var url = para.url;
        var data = para.data || '';
        var async = para.async || true;
        var header = para.header || {};
        var method = para.method || 'GET';
        var eventListener = para.eventListener || {};
        var uploadEventListener = para.uploadEventListener || {};
        
        xhr = new XMLHttpRequest();
        for (var ev in eventListener) {
            xhr.addEventListener(ev, eventListener[ev]);
        }
        for (var ev in uploadEventListener) {
            xhr.upload.addEventListener(ev, uploadEventListener[ev]);
        }
        xhr.open(method, url, async);
        for (var h in header) {
            xhr.setRequestHeader(h, header[h]);
        }
        xhr.send(data);
        return xhr.responseText;
    }
    
    window.app = new app();

})();