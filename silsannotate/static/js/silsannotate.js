$(document).ready(function(){
    // prep the scrollbar:
    $("body").append("<div id='scrollbar'></div>")
    scrollbarScaleFactor = $("#scrollbar").height() / $("html").height()


    var textId = window.location.pathname.split("/")[2]
    var userId = window.location.href.match(/user=(\w+)/)[1]

    var content = $(document.body).annotator();
    content.annotator('addPlugin', 'Store', {
        // The endpoint of the store on your server.
        prefix: '/api',

        // Attach the uri of the current page to all annotations to allow search.
        annotationData: {
            'textId': textId,
            'userId': userId
        }

        // This will perform a "search" action rather than "read" when the plugin
        // loads. Will request the last 20 annotations for the current url.
        // eg. /store/endpoint/search?limit=20&uri=http://this/document/only
        ,loadFromSearch: {
            'limit': 20,
            'textId':textId
        }
    });

    content.annotator('addPlugin', "Scrollbar")

})