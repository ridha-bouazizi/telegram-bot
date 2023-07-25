// enable modify connection form
document.addEventListener("DOMContentLoaded", function() {
    // Get the "conn_edit" button element
    var connEditButton = document.querySelector('[name="conn_edit"]');
    
    // Add a click event listener to the "conn_edit" button
    connEditButton.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        
        // Enable the elements with names "conn_name", "conn_api_id", "conn_api_hash", and "conn_type"
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
                element.removeAttribute("disabled");
                element.removeAttribute("readonly");
            }
        });

        var connTypeRadios = document.querySelectorAll('[name="conn_type"]');
        connTypeRadios.forEach(function(radio) {
            radio.removeAttribute("disabled");
            radio.removeAttribute("readonly");
        });
    });
});

// retrieve connection details
document.addEventListener("DOMContentLoaded", function() {
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
                })
                .catch(function(error) {
                    // Handle errors here
                    console.error("Fetch Error:", error);
                });
        });
    });
});

// Function to format the date as 'YYYY-MM-DDTHH:mm:ss'
function formatDate(dateObj) {
    return `${dateObj.year}-${String(dateObj.month).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}T${String(dateObj.hour).padStart(2, '0')}:${String(dateObj.minute).padStart(2, '0')}:${String(dateObj.second).padStart(2, '0')}`;
}


// update connection details
document.addEventListener("DOMContentLoaded", function() {
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

        // Check if a connection is selected
        if (selectedId) {
            var formData = new FormData(editConnectionForm); // Use the form's ID to get the form data
            var checkboxValue = document.getElementById("formCheck-3").checked;
            formData.append("conn_accept_change", checkboxValue);
            // Send the data to "/updateConnection" with the selected ID as a parameter
            fetch(`/updateConnection?connection_id=${selectedId}`, {
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
                document.querySelector('[name="conn_date"]').value = formatDate(data.message.last_modified);
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
});


// delete connection
document.addEventListener("DOMContentLoaded", function() {
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
                
                // disable elements
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

                // disable radio buttons
                var connTypeRadios = document.querySelectorAll('[name="conn_type"]');
                connTypeRadios.forEach(function(radio) {
                    radio.setAttribute("disabled", "");
                    radio.setAttribute("readonly", "");
                });

                // clear input fields
                document.querySelector('[name="conn_name"]').value = "";
                document.querySelector('[name="conn_date"]').value = "";
                document.querySelector('[name="conn_api_id"]').value = "";
                document.querySelector('[name="conn_api_hash"]').value = "";
                document.querySelector('[name="conn_type"][value="BOT"]').checked = true;

                // disable delete, update and save buttons
                document.querySelector('[name="conn_edit"]').setAttribute("disabled", "");
                document.querySelector('[name="conn_save_edit"]').setAttribute("disabled", "");
                
                // disable checkbox and uncheck
                document.querySelector('[name="conn_accept_change"]').setAttribute("disabled", "");
                document.querySelector('[name="conn_accept_change"]').checked = false;
                
                // delete the connection from dropdown
                var connectionItem = document.querySelector(`[name="connections_item"][id="${selectedId}"]`);
                connectionItem.remove();
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
});


function showFlashedMessages(messages) {
    // Get the container element to display the flashed messages
    const container = document.getElementById("flashedMessages");
    if (!Array.isArray(messages)) {
        messages = [messages];
    }
    // Loop through each flashed message and create the corresponding HTML element
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
  }