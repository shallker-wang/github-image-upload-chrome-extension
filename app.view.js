(function(){

    function view() {

    	this.addImageURLOnNewIssue = function(url, name) {
			$("#issue_body").get(0).value += "\n"+"!["+name+"]("+url+")";
    	}
    }

    view.prototype = {}

    window.app.view = new view();

})();