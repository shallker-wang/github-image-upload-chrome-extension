(function(){
    function app() {

    }

    app.prototype = {
        redirect: function(url) {
            window.location.href = url;
        },
        request: function(method, url, data, dataType, header) {
            return this.ajax({
                method: method,
                url: url,
                data: data,
                dataType: dataType,
                header: header
            });
        },
        get: function(url, data, dataType, header) {
            return this.request('GET', url, data, dataType, header);
        },
        put: function(url, data, dataType, header) {
            return this.request('PUT', url, data, dataType, header);
        },
        post: function(url, data, dataType, header) {
            return this.request('POST', url, data, dataType, header);
        }
    }

    app.prototype.ajax = function(obj) {
        var header = obj.header || {};
        var method = obj.method || 'GET';
        var data = obj.data || '';
        if (obj.dataType == 'json') {
            var data = JSON.stringify(data);
        }
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 201)) {
            }
        }
        xhr.open(method, obj.url, false);
        console.log(header);
        console.log(data);
        for (var i in header) {
            xhr.setRequestHeader(i, header[i]);
        }
        xhr.send(data)
        if (obj.dataType == 'json') {
            return JSON.parse(xhr.responseText);
        }
        return xhr.responseText;
    }

    window.app = new app();

})();