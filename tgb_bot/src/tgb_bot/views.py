from flask import Blueprint, render_template, flash, jsonify, request, redirect, url_for
from flask_login import login_required, current_user
from tgb_bot.models import Connection
from . import db
import json

views = Blueprint('views', __name__)

@views.route('/', methods=['GET', 'POST'])
def home():
    if current_user.is_authenticated:
        return redirect(url_for("views.connections"))
    return redirect(url_for("auth.login"))

@views.route('/connections', methods=['GET', 'POST']) # type: ignore
@login_required
def connections():
    if request.method == 'GET': 
        connections = current_user.connections
        return render_template("connections.html", user=current_user)
    elif request.method == 'POST':
        flash("Invalid request.", category="error")
        return redirect(url_for("views.connections"))
    
@views.route('/deleteConnection', methods=['POST']) # type: ignore
@login_required
def deleteConnection():
    if request.method == 'POST': 
        connection_id = request.form.get('connection_id')
        if connection_id == "":
            flash("Please select a connection.", category="error")
        else:
            try:
                connection = Connection.query.filter_by(id=connection_id).first()
            except Connection.DoesNotExist:
                connection = None

            if connection:
                db.session.delete(connection)
                db.session.commit()
                flash("Connection deleted successfully!", category="success")
            else:
                flash("Connection does not exist.", category="error")
    return redirect(url_for("views.connections"))

@views.route('/createConnection', methods=['POST']) # type: ignore
@login_required
def createConnection():
    if request.method == 'POST': 
        name = request.form.get('new_conn_name')
        api_id = request.form.get('new_conn_api_id')
        api_hash = request.form.get('new_conn_api_hash')
        type = request.form.get('new_conn_type')
        if name == "" or api_id == "" or api_hash == "" or type == "":
            flash("Please fill out all fields.", category="error")
        elif type != "USER" and type != "BOT":
            flash("Please select a valid connection type.", category="error")
        else:

            try:
                connection = Connection.query.filter_by(name=name).first()
            except Connection.DoesNotExist:
                connection = None

            if connection:
                flash("Connection already exists.", category="error")
            else:
                new_connection = Connection(name=name, apiID=api_id, apiSecret=api_hash, type=type, user_id=current_user.id)
                try:
                    db.session.add(new_connection)
                    db.session.commit()
                    flash("Connection created successfully!", category="success")
                except Exception as e:
                    flash("Error creating connection.", category="error")
                    print(e)
    return redirect(url_for("views.connections"))
