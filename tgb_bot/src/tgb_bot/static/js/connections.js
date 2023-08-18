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
				showFlashedMessages([
					{
						message: {
							category: "success",
							text: "Connection details saved successfully.",
						},
					},
				]);
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

function showSendCodeOverlay(connId) {
	const overlay = document.createElement("div");
	overlay.className = "overlay";
	overlay.id = "send-code-overlay";

	const inputLabel = document.createElement("label");
	inputLabel.textContent = "Enter Code:";

	const inputField = document.createElement("input");
	inputField.type = "text";
	inputField.id = "overlay-code-input";

	const submitButton = document.createElement("button");
	submitButton.textContent = "Submit Code";
	submitButton.addEventListener("click", () => {
		const code = document.getElementById("overlay-code-input").value;
		if (code === "" || code === undefined || code === null || code.length < 4 || !code.isInteger()) {
			// Append message to overlay
			const message = document.createElement("p");
			message.textContent = "Please enter a valid code (4 digits minimum).";
			overlay.appendChild(message);
			// Border color red
			document.getElementById("overlay-code-input").style.borderColor = "red";
			return;
		} else {
			success = submitCodeAndConnId(code, connId);
			if (success) {
				overlay.remove();
				showFlashedMessages([
					{
						message: {
							category: "success",
							text: "Session successfully created. You can now use this connection.",
						},
					},
				]);
			} else {
				overlay.remove();
				showFlashedMessages([
					{
						message: {
							category: "danger",
							text: "Error creating session. The connection is therefore not saved. Please try again.",
						},
					},
				]);
			}
		}
	});

	overlay.appendChild(inputLabel);
	overlay.appendChild(inputField);
	overlay.appendChild(submitButton);

	document.body.appendChild(overlay);
}

function submitCodeAndConnId(code, connId) {
	const data = {
		code: code,
		conn_id: connId,
	};

	fetch("/submitCode", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
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
				showFlashedMessagesToast([
					{
						message: {
							category: "success",
							text: "Code submitted successfully.",
						},
					},
				]);
			} else {
				showFlashedMessagesToast([
					{
						message: {
							category: "danger",
							text: "Error submitting code. Please try again.",
						},
					},
				]);
			}
		})
		.catch((error) => {
			console.error("Error:", error);
		});
}

// // Show overlayModal and attach event listener
// function showOverlayModal(connId) {
//     const overlayModal = new bootstrap.Modal(document.getElementById('overlayModal'));
//     overlayModal.show();

//     const connAuthButton = document.getElementById('conn_auth_gss_phone_input');
//     connAuthButton.addEventListener('click', function() {
//         handleConnAuthButtonClick(connId);
//     });
// }

// // Handle conn_auth_gss_phone_input button click
// function handleConnAuthButtonClick(connId) {
//     // Use the connId in your logic
//     console.log('Clicked conn_auth_gss_phone_input with connection ID:', connId);
// }

// // Make sure Bootstrap modal library is loaded
// document.addEventListener('DOMContentLoaded', function() {
//     // Initialize Bootstrap modal if not already done
//     const overlayModal = new bootstrap.Modal(document.getElementById('overlayModal'));
// });

// handleShowLoadingOverlay = function () {
//     const loadingOverlay = document.getElementById("loading-overlay");
//     loadingOverlay.style.display = "flex inline-flex";
// };
// handleHideLoadingOverlay = function () {
//     const loadingOverlay = document.getElementById("loading-overlay");
//     loadingOverlay.style.display = "none";
// };
// handleSendCode = function () {
//     const sendCodeButton = document.getElementById("conn_auth_gss_send_code");
// };
// document.addEventListener("DOMContentLoaded", function () {
//     const sendCodeButton = document.getElementById("conn_auth_gss_send_code");
//     const checkCodeButton = document.getElementById("conn_auth_gss_check_code");
//     sendCodeButton.addEventListener("click", function () {
//         handleShowLoadingOverlay();
//         setTimeout(function () {
//             handleHideLoadingOverlay();
//         }, 2000);
//     });
//     checkCodeButton.addEventListener("click", function () {
//         handleShowLoadingOverlay();
//         setTimeout(function () {
//             handleHideLoadingOverlay();
//         }, 2000);
//     });
// });
