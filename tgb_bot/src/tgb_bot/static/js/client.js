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