var enableAnnotation = true
$(document).ready(function(){

    // add icons
  $("head link[rel='stylesheet']").last().after("<link rel='stylesheet' href='//netdna.bootstrapcdn.com/font-awesome/4.0.0/css/font-awesome.css' type='text/css' media='screen'>");


  // mark text containers
    $("p,h1,h2,h3,h4,h5,h6").addClass("text-container snippets")


    // prep the scrollbar:
    $("body")
        .append("<div id='scrollbar'></div>")
        .append("<div id='menubar'>" +
                        "<div class='submenu enable-annotation'>" +
                            "<h3>Allow annotation</h3>" +
                            "<ul class='enable-disable-annotation'>" +
                                "<li><a class='on active'>On</a></li>" +
                                "<li><a class='off ready'>Off</a></li>" +
                            "</ul>" +
                        "</div>" +
                        "<div class='submenu display-style'>" +
                            "<h3>Display style</h3>" +
                            "<ul class='display-style'>" +
                                "<li><a class='display-style hidden ready'>Hidden</a></li>" +
                                "<li><a class='display-style icons ready'>Icons</a></li>" +
                                "<li><a class='display-style snippets active'>Snippets</a></li>" +
                                "<li><a class='display-style full ready'>Full</a></li>" +
                            "</ul>" +
                      "</div>" +


                      "<div class='submenu users-count count' title='Total users'>" +
                        "<i class='fa fa-group'></i>" +
                        "<span class='num users'></span>" +
                      "</div>" +

                      "<div class='submenu annotations-count count' title='Everyone&apos;s annotations'>" +
                        "<i class='fa fa-comments'></i>" +
                        "<span class='num annotations'></span> " +
                      "</div>" +

                      "<div class='submenu annotations-count count' title='Your annotations'>" +
                        "<i class='fa fa-comment'></i>" +
                        "<span class='num annotations'></span> " +
                      "</div>" +

                    "</div>")




    var url = window.location.pathname
    var cleanUrl = url.replace("sandbox/", "")
    var textId = cleanUrl.split("/")[2]
    var m = window.location.href.match(/user=(\w+)/)

    if (!m){
      alert("you have to be logged in to view; add '?user=<username>' to the url.")
    }

    var userId = m[1]

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