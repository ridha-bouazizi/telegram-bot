from flask import Blueprint, request
from tgb_bot.bot_tasks import start_refactor


bot_task_routes = Blueprint("bot_task_routes", __name__)

@bot_task_routes.post("/start_refactor") # type: ignore
def refactor() -> dict[str, object]:
    conn_id = request.args.get("conn_id")
    mode = request.args.get("mode")
    result = start_refactor.apply_async(args=[conn_id, mode], queue="refactor")
    return {"result_id": result.id}

@bot_task_routes.post("/sendCode") # type: ignore
def sendCode() -> None:
    phone = request.form.get("phone")
    conn_id = request.args.get("conn_id")
    result = sendCode.apply_async(args=[phone, conn_id], queue="sendCode")
    return {"result_id": result.id}