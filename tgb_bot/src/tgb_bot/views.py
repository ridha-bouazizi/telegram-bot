from flask import Blueprint, g, render_template, flash, jsonify, request, redirect, url_for
from flask_login import login_required, current_user
import pexpect
from tgb_bot.models import Connection
from . import db
import json

views = Blueprint("views", __name__)

child = None

@views.route("/", methods=["GET", "POST"])
def home():
    if current_user.is_authenticated:
        return redirect(url_for("views.connections"))
    return redirect(url_for("auth.login"))


@views.route("/connections", methods=["GET", "POST"])  # type: ignore
@login_required
def connections():
    if request.method == "GET":
        connections = current_user.connections
        return render_template("connections.html", user=current_user)
    elif request.method == "POST":
        flash("Invalid request.", category="error")
        return redirect(url_for("views.connections"))


@views.route("/getConnections", methods=["GET"])
def get_connections():
    connections = current_user.connections
    connectionsList = {}
    if len(connections) == 0:
        return jsonify({"connections": connectionsList})
    else:
        for connection in connections:
            connectionsList[connection.id] = connection.name
    # Return the connections data as JSON
    return jsonify({"connections": connectionsList})


@views.route("/saveConnDetails", methods=["POST"])  # type: ignore
@login_required
def saveConnDetails():
    if request.method == "POST":
        name = request.form.get("conn_name")
        phone = request.form.get("conn_phone")
        api_id = request.form.get("api_id")
        api_hash = request.form.get("api_secret")
        type = request.form.get("conn_type")
        try:
            connection = Connection.query.filter_by(apiID=api_id).first()
        except:
            connection = None
        if connection:
            flash("Connection already exists.", category="error")
            return {"success": False}
        else:
            try:
                connection = Connection.query.filter_by(name=name).first()
            except:
                connection = None
            if connection:
                flash("Connection already exists.", category="error")
                return {"success": False}
            else:
                last_modified = db.func.current_timestamp()
                new_connection = Connection(
                    name=name,
                    phone=phone,
                    apiID=api_id,
                    apiSecret=api_hash,
                    type=type,
                    user_id=current_user.id,
                    last_modified=last_modified,
                    session="",
                )
                try:
                    db.session.add(new_connection)
                    db.session.commit()
                    # Save the id of the new connection in new_conn_id
                    new_conn_id = new_connection.id
                    return jsonify({"success": True, "new_conn_id": new_conn_id})
                except Exception as e:
                    return jsonify({"success": False})

@views.route("/createConnection", methods=["POST"])  # type: ignore
@login_required
def createConnection():
    if request.method == "POST":
        name = request.form.get("new_conn_name")
        api_id = request.form.get("new_conn_api_id")
        api_hash = request.form.get("new_conn_api_hash")
        type = request.form.get("new_conn_type")
        if name == "" or api_id == "" or api_hash == "" or type == "":
            flash("Please fill out all fields.", category="error")
        elif type != "USER" and type != "BOT":
            flash("Please select a valid connection type.", category="error")
        else:
            try:
                connection = Connection.query.filter_by(name=name).first()
            except:
                connection = None

            if connection:
                flash("Connection already exists.", category="error")
            else:
                last_modified = db.func.current_timestamp()
                new_connection = Connection(
                    name=name,
                    apiID=api_id,
                    apiSecret=api_hash,
                    type=type,
                    user_id=current_user.id,
                    last_modified=last_modified,
                )
                try:
                    db.session.add(new_connection)
                    db.session.commit()
                    flash("Connection created successfully!", category="success")
                except Exception as e:
                    flash("Error creating connection.", category="error")
                    print(e)
    return redirect(url_for("views.connections"))


@views.route("/getConnection", methods=["GET"])  # type: ignore
@login_required
def getConnection():
    if request.method == "GET":
        connection_id = request.args.get("id")
        if connection_id == "":
            flash("Please select a connection.", category="error")
        else:
            try:
                connection = Connection.query.filter_by(id=connection_id).first()
            except:
                connection = None

            if connection:
                return jsonify(
                    {
                        "name": connection.name,
                        "api_id": connection.apiID,
                        "api_hash": connection.apiSecret,
                        "type": connection.type.value,
                        "id": connection.id,
                        "last_modified": {
                            "day": connection.last_modified.day,
                            "month": connection.last_modified.month,
                            "year": connection.last_modified.year,
                            "hour": connection.last_modified.hour,
                            "minute": connection.last_modified.minute,
                            "second": connection.last_modified.second,
                        },
                    }
                )
            else:
                flash("Connection does not exist.", category="error")
    return redirect(url_for("views.connections"))


@views.route("/updateConnection", methods=["POST"])  # type: ignore
@login_required
def updateConnection():
    if request.method == "POST":
        connection_id = request.args.get("connection_id")
        name = request.form.get("conn_name")
        api_id = request.form.get("conn_api_id")
        api_hash = request.form.get("conn_api_hash")
        type = request.form.get("conn_type")
        conn_accept_change = request.form.get("conn_accept_change")
        if connection_id == "":
            text = "Please select a connection."
            category = "danger"
            message = {"text": text, "category": category}
            return jsonify(message=message)
        elif name == "" or api_id == "" or api_hash == "" or type == "":
            text = "Please fill out all fields."
            category = "danger"
            message = {"text": text, "category": category}
            return jsonify(message=message)
        elif type != "USER" and type != "BOT":
            text = "Please select a valid connection type."
            category = "danger"
            message = {"text": text, "category": category}
            return jsonify(message=message)
        else:
            try:
                connection = Connection.query.filter_by(id=connection_id).first()
            except:
                connection = None

            if connection and connection.user_id == current_user.id:
                if conn_accept_change == "on":
                    connection.name = name
                    connection.apiID = api_id
                    connection.apiSecret = api_hash
                    connection.type = type
                    connection.last_modified = db.func.current_timestamp()
                    try:
                        db.session.commit()
                        text = "Connection updated successfully!"
                        category = "success"
                        message = {
                            "text": text,
                            "category": category,
                            "last_modified": {
                                "day": connection.last_modified.day,
                                "month": connection.last_modified.month,
                                "year": connection.last_modified.year,
                                "hour": connection.last_modified.hour,
                                "minute": connection.last_modified.minute,
                                "second": connection.last_modified.second,
                            },
                        }
                        return jsonify(message=message)
                    except Exception as e:
                        print(e)
                        text = "Error updating connection."
                        category = "danger"
                        message = {"text": text, "category": category}
                        return jsonify(message=message)
                else:
                    text = "Please confirm that you want to update this connection."
                    category = "danger"
                    message = {"text": text, "category": category}
                    return jsonify(message=message)

            else:
                text = "Connection does not exist."
                category = "danger"
                message = {"text": text, "category": category}
                return jsonify(message=message)
    return redirect(url_for("views.connections"))


@views.route("/deleteConnection", methods=["POST"])  # type: ignore
@login_required
def deleteConnection():
    if request.method == "POST":
        connection_id = request.args.get("connection_id")
        conn_accept_delete = request.form.get("conn_accept_delete")
        if connection_id == "":
            text = "Please select a connection."
            category = "danger"
            message = {"text": text, "category": category}
            return jsonify(message=message)
        else:
            try:
                connection = Connection.query.filter_by(id=connection_id).first()
            except:
                connection = None

            if connection and connection.user_id == current_user.id:
                if conn_accept_delete == "on":
                    try:
                        db.session.delete(connection)
                        db.session.commit()
                        text = "Connection deleted successfully!"
                        category = "success"
                        message = {"text": text, "category": category}
                        return jsonify(message=message)
                    except Exception as e:
                        print(e)
                        text = "Error deleting connection."
                        category = "danger"
                        message = {"text": text, "category": category}
                        return jsonify(message=message)
                else:
                    text = "Please confirm that you want to delete this connection."
                    category = "danger"
                    message = {"text": text, "category": category}
                    return jsonify(message=message)

            else:
                text = "Connection does not exist."
                category = "danger"
                message = {"text": text, "category": category}
                return jsonify(message=message)
    return redirect(url_for("views.connections"))

## Route for the rules page
@views.route("/workers", methods=["GET", "POST"])  # type: ignore
@login_required
def rules():
    if request.method == "GET":

        return render_template("workers.html", user=current_user)
    
@views.route("/saveWorkerConfig", methods=["POST"])  # type: ignore
@login_required
def saveWorkerConfig():
    if request.method == "POST":
        connection_id = request.args.get("connection_id")
        filters = request.form.get("filters")
        filtersDict = json.loads(filters)
        from_to = request.form.get("from_to")
        from_toDict = json.loads(from_to)
        worker_settings = request.form.get("worker_settings")
        worker_settingsDict = json.loads(worker_settings)
        if connection_id == "":
            text = "Please select a connection."
            category = "danger"
            message = {"text": text, "category": category}
            return jsonify(message=message)
        elif name == "" or api_id == "" or api_hash == "" or type == "":
            text = "Please fill out all fields."
            category = "danger"
            message = {"text": text, "category": category}
            return jsonify(message=message)
        elif type != "USER" and type != "BOT":
            text = "Please select a valid connection type."
            category = "danger"
            message = {"text": text, "category": category}
            return jsonify(message=message)
        else:
            try:
                connection = Connection.query.filter_by(id=connection_id).first()
            except:
                connection = None

            if connection and connection.user_id == current_user.id:
                if conn_accept_change == "on":
                    connection.name = name
                    connection.apiID = api_id
                    connection.apiSecret = api_hash
                    connection.type = type
                    connection.last_modified = db.func.current_timestamp()
                    try:
                        db.session.commit()
                        text = "Connection updated successfully!"
                        category = "success"
                        message = {
                            "text": text,
                            "category": category,
                            "last_modified": {
                                "day": connection.last_modified.day,
                                "month": connection.last_modified.month,
                                "year": connection.last_modified.year,
                                "hour": connection.last_modified.hour,
                                "minute": connection.last_modified.minute,
                                "second": connection.last_modified.second,
                            },
                        }
                        return jsonify(message=message)
                    except Exception as e:
                        print(e)
                        text = "Error updating connection."
                        category = "danger"
                        message = {"text": text, "category": category}
                        return jsonify(message=message)
                else:
                    text = "Please confirm that you want to update this connection."
                    category = "danger"
                    message = {"text": text, "category": category}
                    return jsonify(message=message)

            else:
                text = "Connection does not exist."
                category = "danger"
                message = {"text": text, "category": category}
                return jsonify(message=message)
    return redirect(url_for("views.connections"))