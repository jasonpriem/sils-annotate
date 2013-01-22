from flask import render_template, abort
from jinja2 import TemplateNotFound
from silsannotate import app
from flask.ext.assets import Environment, Bundle

assets = Environment(app)


@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/text/<text_id>')
def show_text(text_id):
    try:
        return render_template(text_id)
    except TemplateNotFound:
        abort(404, "Whoops, we can't find that...maybe you typed the name wrong?")