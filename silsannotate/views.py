import json, couchdb, os, shortuuid

from flask import render_template, abort, request, make_response
from jinja2 import TemplateNotFound
from silsannotate import app
from flask.ext.assets import Environment, Bundle


couch = couchdb.Server(url=os.getenv("SILS_CLOUDANT_URL"))
db = couch[os.getenv("SILS_CLOUDANT_DB")]

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/text/<text_id>')
def show_text(text_id):
    try:
        return render_template(text_id+".html")
    except TemplateNotFound:
        abort(404, "Whoops, we can't find that...maybe you typed the name wrong?")


@app.route("/store")
def store_root():
    pass

@app.route("/api/search")
def search():
    textId = request.args.get("textId")
    view = db.view("main/by_textId")

    matches = view[textId]
    ret = {
        "total": matches.total_rows,
        "rows": []
    }

    for anno in matches.rows:
        doc = anno["value"]
        doc["id"] = doc["_id"]
        ret["rows"].append(doc)

    resp = make_response(json.dumps(ret, indent=4), 200)
    resp.mimetype = "application/json"
    return resp

@app.route("/api/annotations", methods=["POST"])
def post_new_annotation():
    doc = request.json
    doc["_id"] = shortuuid.uuid()
    couch_resp = db.save(doc)

    resp = make_response(json.dumps(couch_resp, indent=4), 200)
    resp.mimetype = "application/json"
    return resp