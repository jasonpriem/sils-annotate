sils-annotate
=============

An proof-of-concept application for supporting very-large-scale web annotation.


Getting started
----------------

First, you'll need to be able to install Git, as well as download the Git repository, as well as make commits.
Git is kind of intimidating, but don't worry...you can ignore 90% of it and still get enough to be useful. At
least, that's been my plan and it's worked ok :). Here are some introductions of varying levels of complexity:

* http://git-scm.com/book
* http://gitimmersion.com/
* http://www.webdesignerdepot.com/2009/03/intro-to-git-for-web-designers/
* http://www.youtube.com/GitHubGuides


The application has four parts: 

1. a backend written Python using [Flask](http://flask.pocoo.org/), a lightweight web framework; most of this is in silsannotate/views.py
2. a frontend in javascript, built on top of compiled from CoffeeScript from the 
[okfn/annotator](https://github.com/okfn/annotator/) application. That's in the `silsannotate/static/js` folder.
3. a data store in CouchDB. This is currently hosted by [Cloudant.](http://cloudant.com)
4. content to serve (users and articles) which really should be in the db but is in source control since it doesn't
really change and it's easier that way. The information on users is simply a PNG image named with the user's (made up)
first name. These are all in `silsannotate/static/img/users`. The documents to annotate are in 
`silsannotate/templates`; there's one file for every article. Make sure that every article in there has the same
`<head>` stuff as the example article...all of that is necessary to run the javascript application. Yup, it's ugly.

Getting it running locally takes a few steps; [the Heroku docs](https://devcenter.heroku.com/articles/python) have a good guide to get you started.
You'll do it a bit differintly since that's starting a whole new project and you're starting from one already
made. Do all the stuff through creating a virtual environment. Then, [clone this repo](https://devcenter.heroku.com/articles/git-clone-heroku-app)
into that virtual environment and run `pip install silsannotate`. That'll install it into that virtual env.

Finally, you'll need to set the relevant environmental variables. You can get those by running `heroku config --app secure-dusk-1121`.
That'll get you the configs you need to login to Cloudant as well as to run the thing locally; just add them to your
local environment (setting them in ~/.bash_profile is the easiest way). Hopefully you're on Linux or OSX...everything
gets a bit harder if you're on Windows, although it's still possible.

To be honest, if you don't have experience with Python or Heroku this is going to take a while to get going, and quite
a lot of reading and practice; that was true for me anyway. 

The more least-possible-work approach (which probably makes more sense in our case) is: 

1. install  heroku so you can get the configs
