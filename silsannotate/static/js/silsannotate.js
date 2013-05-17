$(document).ready(function(){



    // mark text containers
    $("p,h1,h2,h3,h4,h5,h6").addClass("text-container")


    // prep the scrollbar:
    $("body")
        .append("<div id='scrollbar'></div>")
        .append("<div id='menubar'>" +
                        "<a class='disable-annoting'>Disable annotating</a>" +
                        "<h3>Display style</h3><ul>" +
                        "<li><a class='display-style none ready'>None</a></li>" +
                        "<li><a class='display-style icons active'>Icons</a></li>" +
                        "<li><a class='display-style snippets ready'>Snippets</a></li>" +
                        "<li><a class='display-style snippets ready'>Full</a></li>" +
                        "</ul><h3></h3>" +
                        "</div>")




    var url = window.location.pathname
    var cleanUrl = url.replace("sandbox/", "")
    var textId = cleanUrl.split("/")[2]
    var userId = window.location.href.match(/user=(\w+)/)[1]

    var content = $(document.body).annotator();
    content.annotator('addPlugin', 'Store', {
        // The endpoint of the store on your server.
        prefix: apiRoot, // set at document level by Flask

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