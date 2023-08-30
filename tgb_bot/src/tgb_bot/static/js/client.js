function updateAlertsCount() {
    // Get the number of alerts
    let count = document.querySelectorAll('[name="alertNotification"]').length;
    
    // Get the alerts count badge element
    let alertsCount = document.getElementById("alertsCount");
    
    alertsCount.textContent = count+"+";
}

function dismissAlert(element) {
    // Get all elements with name alertNotification
    element.parentNode.remove();
    updateAlertsCount();
}

function dismissAllAlerts() {
    // Get all elements with name alertNotification
    let alertElements = document.querySelectorAll('[name="alertNotification"]');
        
    alertElements.forEach(function(alertElement) {
        alertElement.remove();
    });
    updateAlertsCount();
}

function showFlashedMessages(messages) {
    // Get the container element to display the flashed messages
    const container = document.getElementById("flashedMessages");
    const notifCenter = document.getElementById("notifCenter");
    if (!Array.isArray(messages)) {
        messages = [messages];
    }
    // Loop through each flashed message and create the corresponding HTML element
    alertDiv = undefined;
    messages.forEach((messageData) => {
      const category = messageData['message']['category'];
      const message = messageData['message']['text'];

    //   const alertDiv = document.createElement("div");
    //   alertDiv.classList.add("alert", `alert-${category}`, "alert-dismissible", "fade", "show");
    //   alertDiv.setAttribute("role", "alert");
    //   alertDiv.innerHTML = `${message}
    //     <button type="button" class="close" data-dismiss="alert">
    //       <span aria-hidden="true">&times;</span>
    //     </button>`;
    //   const node = document.createElement("div");
    //   node.appendChild(alertDiv);
    //   container.insertBefore(alertDiv, container.firstChild);
    //   container.appendChild(node);
        let count = document.querySelectorAll('[name="alertNotification"]').length;
        // Timestamp in the format YYYY-MM-DD, HH:mm:ss in the timezone of the browser
        let currentTimestamp = new Date().toLocaleString();
        if (category === "info") {
            alert = document.createElement("a");
            alert.classList.add("dropdown-item", "d-inline-flex", "flex-row", "align-items-lg-center", "pt-2");
            alert.setAttribute("href", "#");
            alert.setAttribute("style", "background: var(--bs-dropdown-divider-bg); border-width: 4px; border-color: var(--bs-dropdown-bg); border-top-style: solid; border-bottom-style: solid;");
            alert.setAttribute("name", "alertNotification");
            alert.innerHTML = `<div class="mx-1">
                <svg
                    class="bi bi-info-lg fs-1 text-white text-bg-primary border rounded-circle border-1 border-black"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path
                        d="m9.708 6.075-3.024.379-.108.502.595.108c.387.093.464.232.38.619l-.975 4.577c-.255 1.183.14 1.74 1.067 1.74.72 0 1.554-.332 1.933-.789l.116-.549c-.263.232-.65.325-.905.325-.363 0-.494-.255-.402-.704l1.323-6.208Zm.091-2.755a1.32 1.32 0 1 1-2.64 0 1.32 1.32 0 0 1 2.64 0Z"
                    ></path>
                </svg>
            </div>
            <div class="d-inline-flex flex-column justify-content-lg-center align-items-lg-start mx-1 container" style="max-width: 500px; min-width: 300px">
                <span><em class="fs-6 text-dark">${ currentTimestamp }</em></span>
                <hr style="width: 100%; color: var(--bs-emphasis-color); margin-top: 0px; margin-bottom: 0px; border-width: 4px" />
                <p class="text-truncate fs-5 text-dark pt-1" style="margin-bottom: 0px; width: 100%">
                    ${ message }
                </p>
            </div>
            <div class="d-inline-flex flex-column justify-content-lg-center align-items-lg-start justify-content-xl-start align-items-xl-center" onclick="dismissAlert(this)">
                <svg class="bi bi-x fs-1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                    <path
                        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                    ></path>
                </svg>
            </div>
            `
            notifCenter.appendChild(alert)
            updateAlertsCount();
        }
        else if (category === "danger"){
            alert = document.createElement("a");
            alert.classList.add("dropdown-item", "d-inline-flex", "flex-row", "align-items-lg-center", "pt-2");
            alert.setAttribute("href", "#");
            alert.setAttribute("style", "background: var(--bs-dropdown-divider-bg); border-width: 4px; border-color: var(--bs-dropdown-bg); border-top-style: solid; border-bottom-style: solid;");
            alert.setAttribute("name", "alertNotification");
            alert.innerHTML = `<div class="mx-1">
                                    <svg
                                        class="bi bi-exclamation-lg fs-1 text-white text-bg-danger border rounded-circle border-1 border-black"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1em"
                                        height="1em"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M7.005 3.1a1 1 0 1 1 1.99 0l-.388 6.35a.61.61 0 0 1-1.214 0L7.005 3.1ZM7 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"></path>
                                    </svg>
                                </div>
                                <div class="d-inline-flex flex-column justify-content-lg-center align-items-lg-start mx-1 container" style="max-width: 500px; min-width: 300px">
                                    <span><em class="fs-6 text-dark">${ currentTimestamp }</em></span>
                                    <hr style="width: 100%; color: var(--bs-emphasis-color); margin-top: 0px; margin-bottom: 0px; border-width: 4px" />
                                    <p class="text-truncate fs-5 text-dark pt-1" style="margin-bottom: 0px; width: 100%">
                                        ${ message }
                                    </p>
                                </div>
                                <div class="d-inline-flex flex-column justify-content-lg-center align-items-lg-start justify-content-xl-start align-items-xl-center" onclick="dismissAlert(this)">
                                    <svg class="bi bi-x fs-1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                                        <path
                                            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                                        ></path>
                                    </svg>
                                </div>`
            notifCenter.appendChild(alert)
            updateAlertsCount();
        }
        else if (category === "success"){
            alert = document.createElement("a");
            alert.classList.add("dropdown-item", "d-inline-flex", "flex-row", "align-items-lg-center", "pt-2");
            alert.setAttribute("href", "#");
            alert.setAttribute("style", "background: var(--bs-dropdown-divider-bg); border-width: 4px; border-color: var(--bs-dropdown-bg); border-top-style: solid; border-bottom-style: solid;");
            alert.setAttribute("name", "alertNotification");
            alert.innerHTML = ` <div class="mx-1">
                                    <svg
                                        class="bi bi-check-lg fs-1 text-white text-bg-success border rounded-circle border-1 border-black"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1em"
                                        height="1em"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"
                                        ></path>
                                    </svg>
                                </div>
                                <div class="d-inline-flex flex-column justify-content-lg-center align-items-lg-start mx-1 container" style="max-width: 500px; min-width: 300px">
                                    <span><em class="fs-6 text-dark">${ currentTimestamp }</em></span>
                                    <hr style="width: 100%; color: var(--bs-emphasis-color); margin-top: 0px; margin-bottom: 0px; border-width: 4px" />
                                    <p class="text-truncate fs-5 text-dark pt-1" style="margin-bottom: 0px; width: 100%">
                                        ${ message }
                                    </p>
                                </div>
                                <div class="d-inline-flex flex-column justify-content-lg-center align-items-lg-start justify-content-xl-start align-items-xl-center" onclick="dismissAlert(this)">
                                    <svg class="bi bi-x fs-1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                                        <path
                                            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                                        ></path>
                                    </svg>
                                </div>
                                `
        }
    });
    if (alertDiv) {
        alertDiv.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// // Function to format the date as 'YYYY-MM-DDTHH:mm:ss'
// function formatDate(dateObj) {
//     return `${dateObj.year}-${String(dateObj.month).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}T${String(dateObj.hour).padStart(2, '0')}:${String(dateObj.minute).padStart(2, '0')}:${String(dateObj.second).padStart(2, '0')}`;
// }

// // Function to enable modify connection form
// function enableModifyConnectionForm() {
//     const path = window.location.pathname;
//     if (path === "/connections") {
//         // Get the "conn_edit" button element
//         var connEditButton = document.querySelector('[name="conn_edit"]');
        
//         var selectedId = null;
            
//         var dropdownItems = document.querySelectorAll('[name="connections_item"]');
//         dropdownItems.forEach(function(item) {
//             item.addEventListener("click", function(event) {
//                 event.preventDefault(); // Prevent default link behavior
//                 selectedId = item.getAttribute("id"); // Store the selected ID
//             });
//         });

//         // Add a click event listener to the "conn_edit" button
//         connEditButton.addEventListener("click", function(event) {
//             event.preventDefault(); // Prevent the default form submission behavior
//             if (selectedId) {
//                 // Enable the elements with names "conn_name", "conn_api_id", "conn_api_hash", and "conn_type"
//                 var elementsToEnable = [
//                     "conn_name",
//                     "conn_save_edit",
//                     "conn_accept_change",
//                 ];

//                 elementsToEnable.forEach(function(elementName) {
//                     var element = document.querySelector(`[name="${elementName}"]`);
//                     if (element) {
//                         element.removeAttribute("disabled");
//                         element.removeAttribute("readonly");
//                     }
//                 });

//                 var connTypeRadios = document.querySelectorAll('[name="conn_type"]');
//                 connTypeRadios.forEach(function(radio) {
//                     radio.removeAttribute("disabled");
//                     radio.removeAttribute("readonly");
//                 });
//             }
//             else {
//                 showFlashedMessages({ "message": { "category": "danger", "text": "Please select a connection to edit" } });
//             }
//         });
//     }
// }

// // Function to retrieve connection details
// function retrieveConnectionDetails() {
//     // Get all elements with the name "connections_item"
//     var connectionItems = document.querySelectorAll('[name="connections_item"]');
    
//     // Loop through each element and add a click event listener
//     connectionItems.forEach(function(item) {
//         item.addEventListener("click", function(event) {
//             event.preventDefault(); // Prevent the default link behavior

//             // Get the "id" from the link's "id" attribute
//             var id = item.getAttribute("id");

//             // Send a GET request to the route "/getConnection" with the "id" as a parameter
//             fetch(`/getConnection?id=${id}`)
//                 .then(function(response) {
//                     if (!response.ok) {
//                         throw new Error("Network response was not ok");
//                     }
//                     return response.json();
//                 })
//                 .then(function(data) {
//                     // Handle the response data here
//                     console.log(data);

//                     // Inject the response data into the HTML elements
//                     document.querySelector('[name="conn_name"]').value = data.name;
//                     document.querySelector('[name="conn_date"]').value = formatDate(data.last_modified);
//                     document.querySelector('[name="conn_api_id"]').value = data.api_id;
//                     document.querySelector('[name="conn_api_hash"]').value = data.api_hash;
//                     document.querySelector('[name="conn_type"][value="' + data.type.toUpperCase() + '"]').checked = true;
//                     document.querySelector('[name="phone_number"]').value = data.phone_number;
//                     document.querySelector('[name="conn_edit"]').removeAttribute("disabled");
//                 })
//                 .catch(function(error) {
//                     // Handle errors here
//                     console.error("Fetch Error:", error);
//                 });
//         });
//     });
// }

// // Function to update connection details
// function updateConnectionDetails() {
//     const path = window.location.pathname;
//     if (path === "/connections") {
//         var selectedId = null; // Variable to store the selected ID

//         // Add click event listeners to the dropdown items
//         var dropdownItems = document.querySelectorAll('[name="connections_item"]');
//         dropdownItems.forEach(function(item) {
//             item.addEventListener("click", function(event) {
//                 event.preventDefault(); // Prevent default link behavior
//                 selectedId = item.getAttribute("id"); // Store the selected ID
//             });
//         });

//         // Add a click event listener to the "Save changes" button
//         var saveChangesButton = document.querySelector('[name="conn_save_edit"]');
//         saveChangesButton.addEventListener("click", function(event) {
//             event.preventDefault(); // Prevent default button behavior

//             // Check if a connection is selected
//             if (selectedId) {
//                 var formData = new FormData(editConnectionForm); // Use the form's ID to get the form data
//                 var checkboxValue = document.getElementById("formCheck-3").checked;
//                 formData.append("conn_accept_change", checkboxValue);
//                 // Send the data to "/updateConnection" with the selected ID as a parameter
//                 fetch(`/updateConnection?connection_id=${selectedId}`, {
//                     method: "POST", // You can use the appropriate HTTP method (GET, POST, etc.)
//                     body: formData // Use the form's ID to get the form data
//                 })
//                 .then(function(response) {
//                     if (!response.ok) {
//                         throw new Error("Network response was not ok");
//                         message = { "message": { "category": "danger", "text": "Network response was not ok" } };
//                         showFlashedMessages(message);
//                     }
//                     // Handle successful response (if needed)
//                     console.log("Data sent successfully!");
//                     message = { "message": { "category": "success", "text": "Data sent successfully!" } };
//                     showFlashedMessages(message);
//                     return response.json();
//                 })
//                 .then(function(data) {
//                     // Handle the response data here
//                     showFlashedMessages(data);
//                     document.querySelector('[name="conn_date"]').value = formatDate(data.message.last_modified);
//                     getListOfConnections().then(function(connectionsList) {
//                         console.log("List of connections used in the code:");
//                         console.log(connectionsList);
//                         // Update the connection list in the dropdown menu
//                         updateConnectionList(connectionsList);
//                     });
//                 })
//                 .catch(function(error) {
//                     // Handle errors here
//                     console.error("Fetch Error:", error);
//                 });
//             } else {
//                 // Show an error message or perform other actions if no connection is selected
//                 console.log("Please select a connection first.");
//                 message = { "message": { "category": "danger", "text": "Please select a connection first." } };
//                 showFlashedMessages(message);
//             }
//         });
//     }
// }

// // Function to delete connection
// function deleteConnection() {
//     const path = window.location.pathname;
//     if (path === "/connections") {
//         var selectedId = null; // Variable to store the selected ID

//         // Add click event listeners to the dropdown items
//         var dropdownItems = document.querySelectorAll('[name="connections_item"]');
//         dropdownItems.forEach(function(item) {
//             item.addEventListener("click", function(event) {
//                 event.preventDefault(); // Prevent default link behavior
//                 selectedId = item.getAttribute("id"); // Store the selected ID
//             });
//         });

//         // Add a click event listener to the "Delete" button
//         var deleteButton = document.querySelector('[name="conn_delete"]');
//         deleteButton.addEventListener("click", function(event) {
//             event.preventDefault(); // Prevent default button behavior
            
//             // Check if a connection is selected
//             if (selectedId) {
//                 var checkboxValue = document.getElementById("formCheck-4").checked;
//                 var formData = new FormData(editConnectionForm);
//                 formData.append("conn_accept_delete", checkboxValue);
//                 // Send the data to "/deleteConnection" with the selected ID as a parameter
//                 fetch(`/deleteConnection?connection_id=${selectedId}`, {
//                     method: "POST", // You can use the appropriate HTTP method (GET, POST, etc.)
//                     body: formData // Use the form's ID to get the form data
//                 })
//                 .then(function(response) {
//                     if (!response.ok) {
//                         throw new Error("Network response was not ok");
//                         message = { "message": { "category": "danger", "text": "Network response was not ok" } };
//                         showFlashedMessages(message);
//                     }
//                     // Handle successful response (if needed)
//                     console.log("Data sent successfully!");
//                     message = { "message": { "category": "success", "text": "Data sent successfully!" } };
//                     showFlashedMessages(message);
//                     return response.json();
//                 })
//                 .then(function(data) {
//                     // Handle the response data here
//                     showFlashedMessages(data);
                    
//                     // Disable elements
//                     var elementsToEnable = [
//                         "conn_name",
//                         "conn_api_id",
//                         "conn_api_hash",
//                         "conn_save_edit",
//                         "conn_accept_change"
//                     ];
            
//                     elementsToEnable.forEach(function(elementName) {
//                         var element = document.querySelector(`[name="${elementName}"]`);
//                         if (element) {
//                             element.setAttribute("disabled", "");
//                             element.setAttribute("readonly", "");
//                         }
//                     });

//                     // Disable radio buttons
//                     var connTypeRadios = document.querySelectorAll('[name="conn_type"]');
//                     connTypeRadios.forEach(function(radio) {
//                         radio.setAttribute("disabled", "");
//                         radio.setAttribute("readonly", "");
//                     });

//                     // Clear input fields
//                     document.querySelector('[name="conn_name"]').value = "";
//                     document.querySelector('[name="conn_date"]').value = "";
//                     document.querySelector('[name="conn_api_id"]').value = "";
//                     document.querySelector('[name="conn_api_hash"]').value = "";
//                     document.querySelector('[name="phone_number"]').value = "";
//                     document.querySelector('[name="conn_type"][value="BOT"]').checked = true;

//                     // Disable delete, update, and save buttons
//                     document.querySelector('[name="conn_edit"]').setAttribute("disabled", "");
//                     document.querySelector('[name="conn_save_edit"]').setAttribute("disabled", "");
                    
//                     // Disable checkbox and uncheck
//                     document.querySelector('[name="conn_accept_change"]').setAttribute("disabled", "");
//                     document.querySelector('[name="conn_accept_change"]').checked = false;
                    
//                     // Delete the connection from dropdown
//                     var connectionItem = document.querySelector(`[name="connections_item"][id="${selectedId}"]`);
//                     connectionItem.remove();
//                     var checkbox = document.getElementById("formCheck-4");

//                     // Uncheck the checkbox
//                     if (checkbox) {
//                         checkbox.checked = false;
//                     }
//                     selectedId = null;

//                 })
//                 .catch(function(error) {
//                     // Handle errors here
//                     console.error("Fetch Error:", error);
//                 });
//             } else {
//                 // Show an error message or perform other actions if no connection is selected
//                 console.log("Please select a connection first.");
//                 message = { "message": { "category": "danger", "text": "Please select a connection first." } };
//                 showFlashedMessages(message);
//             }
//         });
//     }
// }

// // Function to show flashed messages
// function showFlashedMessages(messages) {
//     // Get the container element to display the flashed messages
//     const container = document.getElementById("flashedMessages");
//     if (!Array.isArray(messages)) {
//         messages = [messages];
//     }
//     // Loop through each flashed message and create the corresponding HTML element
//     alertDiv = undefined;
//     messages.forEach((messageData) => {
//       const category = messageData['message']['category'];
//       const message = messageData['message']['text'];
//       const alertDiv = document.createElement("div");
//       alertDiv.classList.add("alert", `alert-${category}`, "alert-dismissible", "fade", "show");
//       alertDiv.setAttribute("role", "alert");
//       alertDiv.innerHTML = `${message}
//         <button type="button" class="close" data-dismiss="alert">
//           <span aria-hidden="true">&times;</span>
//         </button>`;
//       const node = document.createElement("div");
//       node.appendChild(alertDiv);
//       container.insertBefore(alertDiv, container.firstChild);
//       container.appendChild(node);
//     });
//     if (alertDiv) {
//         alertDiv.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
// }

// // Function to update the connection list in the dropdown menu
// function updateConnectionList(data) {
//     var dropdownMenu = document.querySelector(".dropdown-menu");
//     dropdownMenu.innerHTML = ""; // Clear the existing dropdown menu content


//     for (const key in data.connections) {
//         const connectionId = key;
//         const connectionName = data.connections[key];
      
//         console.log(`Connection ID: ${connectionId}, Connection Name: ${connectionName}`);
//         var dropdownItem = document.createElement("a");
//         dropdownItem.classList.add("dropdown-item");
//         dropdownItem.setAttribute("id", connectionId);
//         dropdownItem.setAttribute("name", "connections_item");
//         dropdownItem.textContent = connectionName;

//         // Append the new dropdown item to the dropdown menu
//         dropdownMenu.appendChild(dropdownItem);
//     }
// }

// // Function to get the list of connections from the API
// function getListOfConnections() {
//     // Send a GET request to the route "/getConnections"
//     return fetch('/getConnections')
//         .then(function(response) {
//             if (!response.ok) {
//                 throw new Error("Network response was not ok");
//             }
//             return response.json();
//         })
//         .then(function(data) {
//             // Extract and return the connections from the API response
//             return data;
//         })
//         .catch(function(error) {
//             // Handle errors here
//             console.error("Fetch Error:", error);
//             return []; // Return an empty array in case of an error
//         });
// }

// // Main function to call all other functions when the DOM is loaded
// document.addEventListener("DOMContentLoaded", function() {
//     enableModifyConnectionForm();
//     retrieveConnectionDetails();
//     updateConnectionDetails();
//     deleteConnection();
// });
