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
                    document.querySelector('[name="conn_type"][value="' + data.type + '"]').checked = true;
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