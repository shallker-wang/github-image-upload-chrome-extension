(function(){
    function app() {

    }

    app.prototype = {
        xhr: new XMLHttpRequest(),
        redirect: function(url) {
            window.location.href = url;
        }
    }

    app.prototype.ajax = new function() {
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 201)) {

            }
        }
        this.get = function(url, data, callback, async) {
            // console.log(this);
            xhr.open('GET', url, async);
            xhr.send(data);
        },
        this.put = function(url, data, callback, async) {},
        this.post = function(url, data, callback, async) {}
    }

    window.app = new app();

})();