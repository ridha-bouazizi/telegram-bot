from flask import Blueprint, request
from tgb_bot.bot_tasks import handle_checkCode, handle_sendCode, start_refactor


bot_task_routes = Blueprint("bot_task_routes", __name__)


@bot_task_routes.post("/start_refactor") # type: ignore
def refactor() -> dict[str, object]:
    conn_id = request.args.get("conn_id")
    mode = request.args.get("mode")
    result = start_refactor.apply_async(args=[conn_id, mode], queue="refactor")
    return {"result_id": result.id}

@bot_task_routes.post("/submitCode")  # type: ignore
# @login_required
def generateSession():
    conn_id = request.form.get("conn_id")
    code = request.form.get("code")
    result = handle_checkCode.apply_async(args=[conn_id, code], queue="checkCode")
    return {"result_id": result.id}