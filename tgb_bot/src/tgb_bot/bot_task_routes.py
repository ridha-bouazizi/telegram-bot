from flask import Blueprint, request
from tgb_bot.bot_tasks import timer


bot_task_routes = Blueprint("bot_task_routes", __name__)

@bot_task_routes.post("/start_sleep") # type: ignore
def start_sleep() -> dict[str, object]:
    worker_name = request.args.get("worker_name", default="default_worker")
    a = request.form.get("a", type=int)
    result = timer.apply_async(args=[a], queue=worker_name)
    return {"result_id": result.id}