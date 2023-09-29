
function startWorker(conn_id) {
	const path = window.location.pathname;
	if (path === "/workers") {
        fetch(`/scheduler/workers/start?conn_id=${conn_id}`, {
            method: "GET",
        })
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            }else{
                message = {
                    message: {
                        category: "danger",
                        text: "Network error. Worker not started!",
                    },
                };
                showFlashedMessages(message);
            }
        })
        .then((data) => {
            taskId = data.task_id;
            if (data) {
                message = {
                    message: {
                        category: "success",
                        text: "Worker started!",
                    },
                };
                showFlashedMessages(message);
            }
        })
        .catch((error) => {
            console.log(error);
        });
	}else{
        message = {
            message: {
                category: "danger",
                text: "Illegal access!",
            },
        };
        showFlashedMessages(message);
    }
}

function stopWorker(connection_id) {
    const path = window.location.pathname;
    if (path === "/workers") {
        fetch(`/scheduler/workers/stop?connection_id=${connection_id}`, {
            method: "GET",
        })
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            }else{
                message = {
                    message: {
                        category: "danger",
                        text: "Network error. Worker not stopped!",
                    },
                };
                showFlashedMessages(message);
            }
        })
        .then((data) => {
            taskId = data.task_id;
            if (data) {
                message = {
                    message: {
                        category: "success",
                        text: "Worker stopped!",
                    },
                };
                showFlashedMessages(message);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }else{
        message = {
            message: {
                category: "danger",
                text: "Illegal access!",
            },
        };
        showFlashedMessages(message);
    }
}