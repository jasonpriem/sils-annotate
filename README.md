sils-annotate
=============

A proof-of-concept application for supporting very-large-scale web annotation.


What's in here?
--------------

There are four parts:

1. The backend is written in Python using the [Flask](http://flask.pocoo.org/) microframework. It runs on Heroku.
Most of that's in in `silsannotate/views.py`.
2. The frontend is written in Javascript, based on the compiled CoffeScript from the 
[okfn/annotator](https://github.com/okfn/annotator/) project. It's all in the `silsannotate/static/js` folder.
3. The data store is CouchDB, currently hosted on [Cloudant](http://cloudant.com).
4. The user and article data is in source control, even though it should be in the db. It's easier this way, especially
since they don't change over time. User data is simply a PNG picture whose name is the user's (made-up) first name.
They're in `silsannotate/static/img/users`. The documents to annotate are in `silsannotate/templates`; there's one 
for every article. Note that you have to copy all the stuff inside the `<head>...</head>` tags into each article or
the application won't load. It's ugly, I know.


To edit locally
----------

You'll need to install and use Git. Thankfully, you can ignore 95% of what Git can do; you just need to be able
to clone, push, and commit. There are lots of tutorials on Git online. Here are a few: 

* http://www.webdesignerdepot.com/2009/03/intro-to-git-for-web-designers/
* http://www.youtube.com/GitHubGuides
* http://sixrevisions.com/resources/git-tutorials-beginners/


To install and run locally
-------------

I'm guessing this won't happen for our project, as it's pretty involved to install. You can follow instructions
from Heroku on [getting started](https://devcenter.heroku.com/articles/python) and cloning from an 
[existing project](https://devcenter.heroku.com/articles/git-clone-heroku-app). Once you've done that, you can get
the relevant configs by running `heroku config --app secure-dusk-1121`; you'll need to [set these up as environmental
variables](https://devcenter.heroku.com/articles/config-vars) on your system.





