// Function to format the date as 'YYYY-MM-DDTHH:mm:ss'
function formatDate(dateObj) {
    return `${dateObj.year}-${String(dateObj.month).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}T${String(dateObj.hour).padStart(2, '0')}:${String(dateObj.minute).padStart(2, '0')}:${String(dateObj.second).padStart(2, '0')}`;
}

// Function to enable modify connection form
function enableModifyConnectionForm() {
    const path = window.location.pathname;
    if (path === "/connections") {
        // Get the "conn_edit" button element
        var connEditButton = document.querySelector('[name="conn_edit"]');
        
        var selectedId = null;
            
        var dropdownItems = document.querySelectorAll('[name="connections_item"]');
        dropdownItems.forEach(function(item) {
            item.addEventListener("click", function(event) {
                event.preventDefault(); // Prevent default link behavior
                selectedId = item.getAttribute("id"); // Store the selected ID
            });
        });

        // Add a click event listener to the "conn_edit" button
        connEditButton.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent the default form submission behavior
            if (selectedId) {
                // Enable the elements with names "conn_name", "conn_api_id", "conn_api_hash", and "conn_type"
                var elementsToEnable = [
                    "conn_name",
                    "conn_save_edit",
                    "conn_accept_change",
                ];

                elementsToEnable.forEach(function(elementName) {
                    var element = document.querySelector(`[name="${elementName}"]`);
                    if (element) {
                        element.removeAttribute("disabled");
                        element.removeAttribute("readonly");
                    }
                });

                var connTypeRadios = document.querySelectorAll('[name="conn_type"]');
                connTypeRadios.forEach(function(radio) {
                    radio.removeAttribute("disabled");
                    radio.removeAttribute("readonly");
                });
            }
            else {
                showFlashedMessages({ "message": { "category": "danger", "text": "Please select a connection to edit" } });
            }
        });
    }
}

// Function to retrieve connection details
function retrieveConnectionDetails() {
    // Get all elements with the name "connections_item"
    var connectionItems = document.querySelectorAll('[name="connections_item"]');
    
    // Loop through each element and add a click event listener
    connectionItems.forEach(function(item) {
        item.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent the default link behavior

            // Get the "id" from the link's "id" attribute
            var id = item.getAttribute("id");

            // Send a GET request to the route "/getConnection" with the "id" as a parameter
            fetch(`/getConnection?id=${id}`)
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then(function(data) {
                    // Handle the response data here
                    console.log(data);

                    // Inject the response data into the HTML elements
                    document.querySelector('[name="conn_name"]').value = data.name;
                    document.querySelector('[name="conn_date"]').value = formatDate(data.last_modified);
                    document.querySelector('[name="conn_api_id"]').value = data.api_id;
                    document.querySelector('[name="conn_api_hash"]').value = data.api_hash;
                    document.querySelector('[name="conn_type"][value="' + data.type.toUpperCase() + '"]').checked = true;
                    document.querySelector('[name="phone_number"]').value = data.phone_number;
                    document.querySelector('[name="conn_edit"]').removeAttribute("disabled");
                })
                .catch(function(error) {
                    // Handle errors here
                    console.error("Fetch Error:", error);
                });
        });
    });
}

// Function to update connection details
function updateConnectionDetails() {
    const path = window.location.pathname;
    if (path === "/connections") {
        var selectedId = null; // Variable to store the selected ID

        // Add click event listeners to the dropdown items
        var dropdownItems = document.querySelectorAll('[name="connections_item"]');
        dropdownItems.forEach(function(item) {
            item.addEventListener("click", function(event) {
                event.preventDefault(); // Prevent default link behavior
                selectedId = item.getAttribute("id"); // Store the selected ID
            });
        });

        // Add a click event listener to the "Save changes" button
        var saveChangesButton = document.querySelector('[name="conn_save_edit"]');
        saveChangesButton.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent default button behavior
			showFlashedMessages([{ message: { category: "danger", text: "This feature is not available yet." } } ]);
            // // Check if a connection is selected
            // if (selectedId) {
            //     var formData = new FormData(editConnectionForm); // Use the form's ID to get the form data
            //     var checkboxValue = document.getElementById("formCheck-3").checked;
            //     formData.append("conn_accept_change", checkboxValue);
            //     // Send the data to "/updateConnection" with the selected ID as a parameter
            //     fetch(`/updateConnection?connection_id=${selectedId}`, {
            //         method: "POST", // You can use the appropriate HTTP method (GET, POST, etc.)
            //         body: formData // Use the form's ID to get the form data
            //     })
            //     .then(function(response) {
            //         if (!response.ok) {
            //             throw new Error("Network response was not ok");
            //             message = { "message": { "category": "danger", "text": "Network response was not ok" } };
            //             showFlashedMessages(message);
            //         }
            //         // Handle successful response (if needed)
            //         console.log("Data sent successfully!");
            //         message = { "message": { "category": "success", "text": "Data sent successfully!" } };
            //         showFlashedMessages(message);
            //         return response.json();
            //     })
            //     .then(function(data) {
            //         // Handle the response data here
            //         showFlashedMessages(data);
            //         document.querySelector('[name="conn_date"]').value = formatDate(data.message.last_modified);
            //         getListOfConnections().then(function(connectionsList) {
            //             console.log("List of connections used in the code:");
            //             console.log(connectionsList);
            //             // Update the connection list in the dropdown menu
            //             updateConnectionList(connectionsList);
            //         });
            //     })
            //     .catch(function(error) {
            //         // Handle errors here
            //         console.error("Fetch Error:", error);
            //     });
            // } else {
            //     // Show an error message or perform other actions if no connection is selected
            //     console.log("Please select a connection first.");
            //     message = { "message": { "category": "danger", "text": "Please select a connection first." } };
            //     showFlashedMessages(message);
            // }
        });
    }
}

// Function to delete connection
function deleteConnection() {
    const path = window.location.pathname;
    if (path === "/connections") {
        var selectedId = null; // Variable to store the selected ID

        // Add click event listeners to the dropdown items
        var dropdownItems = document.querySelectorAll('[name="connections_item"]');
        dropdownItems.forEach(function(item) {
            item.addEventListener("click", function(event) {
                event.preventDefault(); // Prevent default link behavior
                selectedId = item.getAttribute("id"); // Store the selected ID
            });
        });

        // Add a click event listener to the "Delete" button
        var deleteButton = document.querySelector('[name="conn_delete"]');
        deleteButton.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent default button behavior
            
            // Check if a connection is selected
            if (selectedId) {
                var checkboxValue = document.getElementById("formCheck-4").checked;
                var formData = new FormData(editConnectionForm);
                formData.append("conn_accept_delete", checkboxValue);
                // Send the data to "/deleteConnection" with the selected ID as a parameter
                fetch(`/deleteConnection?connection_id=${selectedId}`, {
                    method: "POST", // You can use the appropriate HTTP method (GET, POST, etc.)
                    body: formData // Use the form's ID to get the form data
                })
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                        message = { "message": { "category": "danger", "text": "Network response was not ok" } };
                        showFlashedMessages(message);
                    }
                    // Handle successful response (if needed)
                    console.log("Data sent successfully!");
                    message = { "message": { "category": "success", "text": "Data sent successfully!" } };
                    showFlashedMessages(message);
                    return response.json();
                })
                .then(function(data) {
                    // Handle the response data here
                    showFlashedMessages(data);
                    
                    // Disable elements
                    var elementsToEnable = [
                        "conn_name",
                        "conn_api_id",
                        "conn_api_hash",
                        "conn_save_edit",
                        "conn_accept_change"
                    ];
            
                    elementsToEnable.forEach(function(elementName) {
                        var element = document.querySelector(`[name="${elementName}"]`);
                        if (element) {
                            element.setAttribute("disabled", "");
                            element.setAttribute("readonly", "");
                        }
                    });

                    // Disable radio buttons
                    var connTypeRadios = document.querySelectorAll('[name="conn_type"]');
                    connTypeRadios.forEach(function(radio) {
                        radio.setAttribute("disabled", "");
                        radio.setAttribute("readonly", "");
                    });

                    // Clear input fields
                    document.querySelector('[name="conn_name"]').value = "";
                    document.querySelector('[name="conn_date"]').value = "";
                    document.querySelector('[name="conn_api_id"]').value = "";
                    document.querySelector('[name="conn_api_hash"]').value = "";
                    document.querySelector('[name="phone_number"]').value = "";
                    document.querySelector('[name="conn_type"][value="BOT"]').checked = true;

                    // Disable delete, update, and save buttons
                    document.querySelector('[name="conn_edit"]').setAttribute("disabled", "");
                    document.querySelector('[name="conn_save_edit"]').setAttribute("disabled", "");
                    
                    // Disable checkbox and uncheck
                    document.querySelector('[name="conn_accept_change"]').setAttribute("disabled", "");
                    document.querySelector('[name="conn_accept_change"]').checked = false;
                    
                    // Delete the connection from dropdown
                    var connectionItem = document.querySelector(`[name="connections_item"][id="${selectedId}"]`);
                    connectionItem.remove();
                    var checkbox = document.getElementById("formCheck-4");

                    // Uncheck the checkbox
                    if (checkbox) {
                        checkbox.checked = false;
                    }
                    selectedId = null;

                })
                .catch(function(error) {
                    // Handle errors here
                    console.error("Fetch Error:", error);
                });
            } else {
                // Show an error message or perform other actions if no connection is selected
                console.log("Please select a connection first.");
                message = { "message": { "category": "danger", "text": "Please select a connection first." } };
                showFlashedMessages(message);
            }
        });
    }
}

// Function to show flashed messages
function showFlashedMessages(messages) {
    // Get the container element to display the flashed messages
    const container = document.getElementById("flashedMessages");
    if (!Array.isArray(messages)) {
        messages = [messages];
    }
    // Loop through each flashed message and create the corresponding HTML element
    alertDiv = undefined;
    messages.forEach((messageData) => {
      const category = messageData['message']['category'];
      const message = messageData['message']['text'];
      const alertDiv = document.createElement("div");
      alertDiv.classList.add("alert", `alert-${category}`, "alert-dismissible", "fade", "show");
      alertDiv.setAttribute("role", "alert");
      alertDiv.innerHTML = `${message}
        <button type="button" class="close" data-dismiss="alert">
          <span aria-hidden="true">&times;</span>
        </button>`;
      const node = document.createElement("div");
      node.appendChild(alertDiv);
      container.insertBefore(alertDiv, container.firstChild);
      container.appendChild(node);
    });
    if (alertDiv) {
        alertDiv.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// Function to update the connection list in the dropdown menu
function updateConnectionList(data) {
    var dropdownMenu = document.querySelector(".dropdown-menu");
    dropdownMenu.innerHTML = ""; // Clear the existing dropdown menu content


    for (const key in data.connections) {
        const connectionId = key;
        const connectionName = data.connections[key];
      
        console.log(`Connection ID: ${connectionId}, Connection Name: ${connectionName}`);
        var dropdownItem = document.createElement("a");
        dropdownItem.classList.add("dropdown-item");
        dropdownItem.setAttribute("id", connectionId);
        dropdownItem.setAttribute("name", "connections_item");
        dropdownItem.textContent = connectionName;

        // Append the new dropdown item to the dropdown menu
        dropdownMenu.appendChild(dropdownItem);
    }
}

// Function to get the list of connections from the API
function getListOfConnections() {
    // Send a GET request to the route "/getConnections"
    return fetch('/getConnections')
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(function(data) {
            // Extract and return the connections from the API response
            return data;
        })
        .catch(function(error) {
            // Handle errors here
            console.error("Fetch Error:", error);
            return []; // Return an empty array in case of an error
        });
}

// Main function to call all other functions when the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    enableModifyConnectionForm();
    retrieveConnectionDetails();
    updateConnectionDetails();
    deleteConnection();
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to show flashed messages as toast
function showFlashedMessagesToast(messages) {
	const toastContainer = document.getElementById("flashedMessagesToast");
	const toastTemplate = document.createElement("template");
	// Flush toasts
	toastContainer.innerHTML = "";
	// Create toast template
	toastTemplate.innerHTML = `
    <div class="toast fade show" role="alert" data-bs-delay="5000" aria-live="assertive" aria-atomic="true" data-delay="5000" style="display:block;">
      <div class="toast-header text-bg-danger">
        <svg class="bi bi-shield-exclamation" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" style="width: 15px;height: 15px;margin-right: 10px;">
          <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"></path>
          <path d="M7.001 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.553.553 0 0 1-1.1 0L7.1 4.995z"></path>
        </svg>
        <strong class="me-auto">Message</strong>
        <button type="button" class="btn-close ms-2 mb-1 close" aria-label="Close" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body" role="alert">
        Hello, world! This is a toast message.
      </div>
    </div>
  `;
	messages.forEach((message) => {
		const toast = toastTemplate.content.cloneNode(true);
		toast.querySelector(".toast").classList.add(`bg-${message.message.category}`);
		toast.querySelector(".toast-body").textContent = message.message.text;
		toastContainer.appendChild(toast);
	});
	$(".toast").toast("show");
}

// Handle form submission and showing overlayModal
function saveConnectionDetails() {
	// Replace this part with your actual form data collection logic
	const formData = new FormData();
	formData.append("conn_name", document.getElementById("new_conn_name").value);
	formData.append("conn_phone", document.getElementById("new_conn_phone").value);
	formData.append("api_id", document.getElementById("new_api_id").value);
	formData.append("api_secret", document.getElementById("new_api_secret").value);
	formData.append("conn_type", document.querySelector('input[name="new_conn_type"]:checked').value);

	// Validation checks for the form data
	if (formData.get("conn_name") === "" || formData.get("conn_name") === undefined || formData.get("conn_name") === null) {
		showFlashedMessages([
			{
				message: {
					category: "danger",
					text: "Please enter a name for the connection and save again.",
				},
			},
		]);
		return;
	}
	// check for phone numer in the format +919876543210
	if (
		formData.get("conn_phone") === "" ||
		isNaN(formData.get("conn_phone")) ||
		!Number.isInteger(Number(formData.get("conn_phone"))) ||
		formData.get("conn_phone").length < 10 ||
		formData.get("conn_phone").length > 15 ||
		formData.get("conn_phone").charAt(0) !== "+"
	) {
		showFlashedMessages([
			{
				message: {
					category: "danger",
					text: "Please enter a phone number in the format +919876543210 (country code followed by phone number).",
				},
			},
		]);
		return;
	}
	if (formData.get("api_id") === "" || isNaN(formData.get("api_id")) || !Number.isInteger(Number(formData.get("api_id")))) {
		showFlashedMessages([
			{
				message: {
					category: "danger",
					text: "Please enter an API ID (integer) for the connection (can be any number) and save again.",
				},
			},
		]);
		return;
	}
	if (formData.get("api_secret") === "" || formData.get("api_secret").length < 32) {
		showFlashedMessages([
			{
				message: {
					category: "danger",
					text: "Please enter an API Secret (string) for the connection (can be any string of length 32 or more) and save again.",
				},
			},
		]);
		return;
	}
	if (formData.get("conn_type") === "" || formData.get("conn_type") === undefined || formData.get("conn_type") === null) {
		showFlashedMessages([
			{
				message: {
					category: "danger",
					text: "Please select a connection type and save again.",
				},
			},
		]);
		return;
	}

	// Send the form data to the server using fetch or any other AJAX method
	fetch("/saveConnDetails", {
		method: "POST",
		body: formData,
	})
		.then(function (response) {
			if (!response.ok) {
				showFlashedMessages([
					{
						message: {
							category: "danger",
							text: "Error saving connection details. Please try again.",
						},
					},
				]);

				throw Error(response.statusText);
			} else {
				return response.json();
			}
		})
		.then((data) => {
			// Assuming the response data contains the saved connection ID
			if (data.success) {
				const connId = data.conn_id;
				showSendCodeOverlay(connId);
			}
		})
		.catch((error) => {
			console.log("Error:", error);
		});
}

function calculatePercentage(timeLeft) {
	return ((120 - timeLeft) / 120) * 100;
}

function showSendCodeOverlay(connId) {
	const modalContainer = document.createElement("div");
	modalContainer.className = "modal fade";
	modalContainer.id = "overlayModal";
	modalContainer.tabIndex = "-1";
	modalContainer.setAttribute("aria-labelledby", "overlayModalLabel");
	modalContainer.setAttribute("aria-hidden", "true");
	modalContainer.innerHTML = `
	<div class="modal-dialog" style="max-width: 80%">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="overlayModalLabel">
				Type the code you've received on your phone (Telegram App):
				</h5>
				<button
				type="button"
				id="closeTopRight"
				class="btn-close"
				data-bs-dismiss="modal"
				aria-label="Close"
				></button>

				
			</div>
			<div class="progress">
				<div
					id="countdown-progress"
					class="progress-bar"
					role="progressbar"
					aria-valuemin="0"
					aria-valuemax="100"
				></div>
			</div>
			<div class="modal-body">
				<div
					class="row mb-3"
					style="margin-right: 0px; margin-left: 0px"
				>
					<div
					class="col d-lg-flex justify-content-lg-center align-items-lg-center col-12"
					>
						<input
							id="conn_auth_gss_code_input"
							type="password"
							inputmode="numeric"
							required
							minlength="4"
							maxlength="20"
							style="
							margin-right: 5px;
							margin-left: 5px;
							min-width: 30%;
							max-width: 40%;
							min-height: 100%;
							"
							placeholder="(e.g. 1234)"
						/><button
							id="conn_auth_gss_check_code"
							class="btn btn-primary btn-sm"
							type="button"
							style="margin-right: 5px; margin-left: 5px"
						>
							<svg
							class="bi bi-check-lg"
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							fill="currentColor"
							viewBox="0 0 16 16"
							style="width: 20px; height: 20px"
							>
							<path
								d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"
							></path>
							</svg>
						</button>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" id="closeBottomRight" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
	`;
	// Append the modal to the form
	form = document.getElementById("createConnectionForm");
	form.appendChild(modalContainer);
	let timeLeft = 120; // 2 minutes in seconds
	const updateInterval = 1000; // 1 second in milliseconds
	
	// Initialize the progress bar
	const progressBar = document.getElementById("countdown-progress");
	progressBar.style.width = calculatePercentage(timeLeft) + "%";

	// Update the progress bar and check for timer completion
	let countdownInterval = setInterval(function () {
		timeLeft--;

		// Update the progress bar width
		progressBar.style.width = calculatePercentage(timeLeft) + "%";
		
		progressBar.textContent = `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;

		if (timeLeft <= 30) {
			progressBar.classList.remove("bg-info"); // Remove default info styling
			progressBar.classList.add("bg-danger"); // Add danger styling
		}

		if (timeLeft <= 0) {
			clearInterval(countdownInterval); // Clear the interval
			revoke(); // Call the revoke() function
		}
	}, updateInterval);
	// Show the modal
	const modal = new bootstrap.Modal(document.getElementById("overlayModal"));
	modal.show();
	const closeButtonTopRight = modalContainer.querySelector(".btn-close");
	closeButtonTopRight.addEventListener("click", () => {
		modal.hide();
		// Remove modal from DOM
		document.getElementById("overlayModal").remove();
		countdownInterval = null;
	});
	const closeButtonBottom = modalContainer.querySelector(".btn-secondary");
	closeButtonBottom.addEventListener("click", () => {
		modal.hide();
		// Remove modal from DOM
		document.getElementById("overlayModal").remove();
		countdownInterval = null;
	});
	const submitButton = document.getElementById("conn_auth_gss_check_code");
	submitButton.addEventListener("click", () => {
		const code = document.getElementById("conn_auth_gss_code_input").value;
		if (code === "" || code === undefined || code === null || code.length < 4 || Number.isNaN(Number(code))) {
			// Append message to overlay
			const message_div = document.createElement("div");
			message_div.classList.add("alert");
			message_div.classList.add("alert-danger");
			message_div.classList.add("alert-dismissible");
			message_div.classList.add("d-inline-flex");
			message_div.classList.add("d-lg-flex");
			message_div.classList.add("justify-content-lg-center");
			message_div.classList.add("align-items-lg-center");
			const message = document.createElement("p");
			message.classList.add("mb-0");
			message.classList.add("text-danger");
			message.textContent = "Please enter a valid code (4 digits minimum).";
			const close_button = document.createElement("button");
			close_button.classList.add("btn-close");
			close_button.setAttribute("type", "button");
			close_button.setAttribute("data-bs-dismiss", "alert");
			close_button.setAttribute("aria-label", "Close");
			message_div.appendChild(message);
			message_div.appendChild(close_button);
			const modal_body = document.querySelector(".modal-body");
			modal_body.appendChild(message_div);
			// Border color red
			document.getElementById("conn_auth_gss_code_input").style.borderColor = "red";
			return;
		} else {
			success = submitCodeAndConnId(code, connId);
			document.getElementById("overlayModal").remove();
			modal.hide();
			// Remove modal from DOM
			document.getElementById("overlayModal").remove();
		}
	});
}

function submitCodeAndConnId(code, connId) {
	formData = new FormData();
	formData.append("code", code);
	formData.append("conn_id", connId);
	fetch("/scheduler/submitCode", {
		method: "POST",
		body: formData,
	})
		.then(function (response) {
			if (!response.ok) {
				showFlashedMessages([
					{
						message: {
							category: "danger",
							text: "Error submitting code. Please try again.",
						},
					},
				]);

				throw Error(response.statusText);
			} else {
				return response.json();
			}
		})
		.then((responseData) => {
			if (responseData.success) {
				// Code successfully submitted
				showFlashedMessages([
					{
						message: {
							category: "success",
							text: "Code submitted successfully. However session creation is still in progress. Please wait a few seconds and refresh the page.",
						},
					},
				]);
				return true;
			} else {
				showFlashedMessages([
					{
						message: {
							category: "danger",
							text: "Error submitting code. Please try again.",
						},
					},
				]);
				return false;
			}
		})
		.catch((error) => {
			console.error("Error:", error);
			return false;
		});
}