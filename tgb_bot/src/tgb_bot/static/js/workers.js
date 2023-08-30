let selectedWorkerConn = undefined;
function calculateNumberOfFilterKeys() {
  let priorityMenu = document.getElementById(`items_tab_items`);
  let PrioritiesTabList = priorityMenu.getElementsByTagName("li");
  return PrioritiesTabList.length;
}
function updatePriorityMenuItems(type) {
  let priorityMenu = document.getElementById(`priority_${type}_menu`);
  let priorityMenuItems = priorityMenu.children;
  let numberOfFilterKeys = calculateNumberOfFilterKeys();
  for (let i = 0; i < priorityMenuItems.length; i++) {
    priorityMenuItems[i].textContent = i + 1;
    priorityMenuItems[i].id = `priority_${type}${i + 1}_menu_item`;
    priorityMenuItems[i].href = `#`;
    priorityMenuItems[i].onclick = () => {
      let priorityButton = document.getElementById(`priority_${type}_button`);
      priorityButton.textContent = `Priority: ${i + 1}`;
      priorityButton.id = `priority_${type}${i + 1}_button`;
      priorityButton.setAttribute("data-bs-toggle", "dropdown");
      priorityButton.setAttribute("aria-expanded", "false");
      priorityButton.onclick = () => {
        let priorityMenu = document.getElementById(`priority_${type}_menu`);
        priorityMenu.style.display = "block";
      };
      priorityMenu.style.display = "none";
    };
  }
}

function updateSelectedFilterPriorities(type, action, inputId) {}
function updatePriorityDropDown(type, action, inputId) {
  let prioritytabContents = document.getElementById(`items_tab_content`);
  let prioritiesdropdownList =
    prioritytabContents.getElementsByClassName("dropdown-menu");
  let nbOfFilters = calculateNumberOfFilterKeys();
  if (!prioritiesdropdownList || nbOfFilters === 0) {
    return;
  }
  if (action === "add") {
    Array.from(prioritiesdropdownList).forEach((element) => {
      let menuItem = document.createElement("a");
      menuItem.className = "dropdown-item";
      menuItem.href = "#"; // Set the appropriate href
      menuItem.textContent = nbOfFilters + 1;
      document.getElementById(element.getAttribute("Id")).appendChild(menuItem);
    });
  } else if (action === "remove") {
    Array.from(prioritiesdropdownList).forEach((element) => {
      element.removeChild(element.lastChild);
    });
  }
}

function removeRefactorTab(type, inputId) {
  updatePriorityDropDown(type, "remove", inputId);
  let tabToRemove = document.getElementById(`${type}${inputId}_tab`);
  let tabToRemoveExists = tabToRemove != null ? true : false;
  let tabContentToRemove = document.getElementById(`items_${type}${inputId}`);

  if (tabToRemoveExists) {
    tabToRemove.remove();
    tabContentToRemove.remove();
  }
}
function handleAddRuleClick(type, inputId) {
  const container = document.getElementById(`items_${type}${inputId}`);
  if (container) {
    ruleCount = container.childElementCount - 2;
    const newRow = document.createElement("div");
    newRow.id = `${type}${inputId}_rule_row${ruleCount + 1}`;
    newRow.className = "row";
    newRow.innerHTML = `
            <div class="col">
                <div class="d-flex" style="padding-top: 5px; padding-bottom: 5px;">
                    <button id="${type}${inputId}_rule_row${ruleCount+1}_del_rule" class="btn btn-danger btn-sm" type="button" style="margin-right: 10px; margin-left: 10px;">
                        <svg class="bi bi-dash-lg fs-4" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"></path>
                        </svg>
                    </button>
                    <div class="dropdown" style="margin-right: 10px;">
                        <button id="${type}${inputId}_rule_row${ruleCount+1}_select_rule_button" class="btn btn-primary dropdown-toggle" aria-expanded="false" data-bs-toggle="dropdown" type="button">Select Rule :</button>
                        <div id="${type}${inputId}_rule_row${ruleCount+1}_select_rule_menu" class="dropdown-menu">
                          <a id="rule_delete" class="dropdown-item" href="#">Delete</a>
                          <a id="rule_delete_all" class="dropdown-item" href="#">Delete full entry</a>
                          <a id="rule_insert_before" class="dropdown-item" href="#">Insert before</a>
                          <a id="rule_insert_after" class="dropdown-item" href="#">Insert after</a>
                          <a id="rule_replace" class="dropdown-item" href="#">Replace with</a>
                          <a id="rule_strip_space" class="dropdown-item" href="#">Strip whitespaces</a>
                          <a id="rule_strip_other" class="dropdown-item" href="#">Strip other</a>
                          <a id="rule_upper" class="dropdown-item" href="#">TO UPPERCASE</a>
                          <a id="rule_lower" class="dropdown-item" href="#">to lowercase</a>
                        </div>
                    </div>
                    <input id="${type}${inputId}_rule_row${ruleCount+1}_input" class="form-control" type="text" style="margin-right: 10px;" />
                </div>
            </div>
        `;
    container.appendChild(newRow);
  }
}

function createRefactorTab(type, inputId) {
  updatePriorityDropDown(type, "add", inputId);
  let tabItemsContainer = document.getElementById("items_tab_items");
  let tabContentContainer = document.getElementById("items_tab_content");
  // Create a new tab
  let newTab = document.createElement("li");
  newTab.className = "nav-item";
  newTab.id = `${type}${inputId}_tab`;
  newTab.role = "presentation";

  let newTabLink = document.createElement("a");
  newTabLink.className = "nav-link";
  newTabLink.setAttribute("role", "tab");
  newTabLink.setAttribute("data-bs-toggle", "tab");
  newTabLink.href = `#items_${type}${inputId}`;
  let inputName = `${type.toUpperCase()}${inputId}`;
  newTabLink.textContent = `${inputName}`;

  newTab.appendChild(newTabLink);
  tabItemsContainer.appendChild(newTab);

  // Create a new tab content
  let newTabContent = document.createElement("div");
  newTabContent.id = `items_${type}${inputId}`;
  newTabContent.className = "tab-pane";
  newTabContent.role = "tabpanel";

  // Create a new row
  let row1 = document.createElement("div");
  row1.className = "row";
  row1.style.paddingTop = "5px";
  row1.style.paddingBottom = "5px";

  // Create a new column
  let col = document.createElement("div");
  col.className = "col";

  // Create a new dropdown container
  let dropdown = document.createElement("div");
  dropdown.id = `priority_${type}${inputId}`;
  dropdown.className = "dropdown";

  // Create a new dropdown button
  let button = document.createElement("button");
  button.id = `priority_${type}${inputId}_button`;
  button.className = "btn btn-primary dropdown-toggle";
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("data-bs-toggle", "dropdown");
  button.type = "button";
  button.textContent = "Set Priority: ";

  // Create a new dropdown menu
  let menu = document.createElement("div");
  menu.id = `priority_${type}${inputId}_menu`;
  menu.className = "dropdown-menu";

  let menuItems = [];
  let menuItemTexts = [];

  // Add from 1 to inputId menu menuItemTexts
  for (let i = 1; i <= parseInt(calculateNumberOfFilterKeys()); i++) {
    menuItemTexts.push(`${i}`);
  }

  menuItemTexts.forEach((text) => {
    let menuItem = document.createElement("a");
    menuItem.className = "dropdown-item";
    menuItem.href = "#"; // Set the appropriate href
    menuItem.textContent = text;
    menuItems.push(menuItem);
  });

  menuItems.forEach((item) => menu.appendChild(item));
  dropdown.appendChild(button);
  dropdown.appendChild(menu);

  col.appendChild(dropdown);

  row1.appendChild(col);

  newTabContent.appendChild(row1);

  // Create a new row
  let row2 = document.createElement("div");
  row2.className = "row";
  row2.style.paddingTop = "5px";
  row2.style.paddingBottom = "5px";

  // Create a new column
  let col2 = document.createElement("div");
  col2.className = "col";

  // Create a new button
  let addButton = document.createElement("button");
  addButton.id = `add_${type}${inputId}_button`;
  addButton.className =
    "btn btn-primary d-flex justify-content-between align-items-center align-content-center";
  addButton.type = "button";
  addButton.style.width = "190px";

  addButton.innerHTML = `
        <span>ADD Rule</span>
        <svg class="bi bi-plus-square-dotted fs-4" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
          <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"></path>
        </svg>
      `;
  addButton.setAttribute(onclick, handleAddRuleClick(type, inputId));
  // addButton.addEventListener("click", handleAddRuleClick(type, inputId));
  // Add button2 to col2
  col2.appendChild(addButton);

  // Add col2 to row2
  row2.appendChild(col2);

  // Add row2 to container
  newTabContent.appendChild(row2);

  // Add tab content to the tabContent container
  tabContentContainer.appendChild(newTabContent);
}

function generateFilterItems(type, CheckStatus, rows) {
  inputId = undefined;
  inputName = undefined;
  if (CheckStatus) {
    currentRow = rows.childElementCount;
    if (currentRow === 0) {
      // Add a new row to rgx_rows
      newRow = document.createElement("div");
      newRow.className = "row";
      newRow.style = "padding-bottom: 4px;";
      newRow.id = `${type}_row${currentRow + 1}`;
      rows.appendChild(newRow);
      // Add first column of three columns
      let newCol = document.createElement("div");
      newCol.className = "col col-4";
      inputId = `${currentRow + 1}`;
      inputName = `${type.toUpperCase()}${currentRow + 1}`;
      newCol.innerHTML = `
          <div class="row">
            <label class="form-label col-sm-3 col-form-label">${type.toUpperCase()}${1}</label>
            <div class="col-sm-9">
              <input id="${type}${
        currentRow + 1
      }_input" class="form-control" type="text" />
            </div>
          </div>
        `;
      newCol.id = `${type}_row${currentRow + 1}_col${1}`;
      newRow.appendChild(newCol);
    } else {
      currentRow = rows.childElementCount;
      currentColumn = rows.lastElementChild.childElementCount;
      // if the value of the input in the last column is empty, do not add a new column
      if (
        document.getElementById(
          `${type}${(currentRow - 1) * 3 + currentColumn}_input`
        ).value != ""
      ) {
        if (currentColumn < 3) {
          inputId = `${(currentRow - 1) * 3 + currentColumn + 1}`;
          inputName = `${type.toUpperCase()}${
            (currentRow - 1) * 3 + currentColumn + 1
          }`;
          // Add first column of three columns
          let newCol = document.createElement("div");
          newCol.className = "col col-4";
          newCol.innerHTML = `
            <div class="row">
              <label class="form-label col-sm-3 col-form-label">${type.toUpperCase()}${
            (currentRow - 1) * 3 + currentColumn + 1
          }</label>
              <div class="col-sm-9">
                <input id="${type}${
            (currentRow - 1) * 3 + currentColumn + 1
          }_input" class="form-control" type="text" />
              </div>
            </div>
            `;
          newCol.id = `${type}_row${currentRow}_col${currentColumn + 1}`;
          rows.lastElementChild.appendChild(newCol);
        } else {
          inputId = `${(currentRow - 1) * 3 + currentColumn + 1}`;
          inputName = `${type.toUpperCase()}${
            (currentRow - 1) * 3 + currentColumn + 1
          }`;
          // Add a new row to rgx_rows and insert a column
          newRow = document.createElement("div");
          newRow.className = "row";
          newRow.style = "padding-bottom: 4px;";
          newRow.id = `${type}_row${currentRow + 1}`;
          rows.appendChild(newRow);
          // Add first column of three columns
          let newCol = document.createElement("div");
          newCol.className = "col col-4";
          newCol.innerHTML = `
            <div class="row">
              <label class="form-label col-sm-3 col-form-label">${type.toUpperCase()}${
            (currentRow - 1) * 3 + currentColumn + 1
          }</label>
              <div class="col-sm-9">
                <input id="${type}${
            (currentRow - 1) * 3 + currentColumn + 1
          }_input" class="form-control" type="text" />
              </div>
            </div>
            `;
          newCol.id = `${type}_row${currentRow + 1}_col${1}`;
          newRow.appendChild(newCol);
        }
      }
    }
    document
      .getElementById(`${type}${inputId}_input`)
      .addEventListener("change", onInputChange);
  }
}

function onInputChange(oEvent) {
  const strId = this.getAttribute("Id");
  let oIdNum = strId.match(/[0-9]+/);
  let inputId = parseInt(oIdNum[0]);
  let type = strId.substring(0, oIdNum.index);
  let inputNotEmpty = this.value.trim() ? true : false;
  let prevInput = document.getElementById(`${type}${inputId - 1}_input`);
  let prevInputTabExists = document.getElementById(`${type}${inputId - 1}_tab`)
    ? true
    : false;
  let nextInput = document.getElementById(`${type}${inputId + 1}_input`);
  let nextInputTabExists = document.getElementById(`${type}${inputId + 1}_tab`)
    ? true
    : false;
  let tabExists = document.getElementById(`${type}${inputId}_tab`)
    ? true
    : false;
  if (inputNotEmpty) {
    if (prevInputTabExists) {
      prevInput.disabled = true;
    }
    if (!tabExists) {
      createRefactorTab(type, inputId);
    }
  } else {
    if (prevInput) {
      prevInput.disabled = false;
    }
    if (tabExists) removeRefactorTab(type, inputId);

    if (nextInput) {
      if (nextInput.value.trim()) {
        // place of value of next input to current input
        this.value = nextInput.value;
      }
      nextInput.parentNode.parentNode.parentNode.remove();
      if (nextInputTabExists) {
        //remove tab of next input when remove the next input
        removeRefactorTab(type, inputId + 1);
      }
    }
  }
}
function handleAddButtonClick() {
  let useRegexCheck = document.getElementById("use_regex_check");
  let rgxAddButton = document.getElementById("rgx_add_button");
  let rgxRows = document.getElementById("rgx_rows");

  let useCsCheck = document.getElementById("use_cs_check");
  let csAddButton = document.getElementById("cs_add_button");
  let csRows = document.getElementById("cs_rows");

  let useCiCheck = document.getElementById("use_ci_check");
  let ciAddButton = document.getElementById("ci_add_button");
  let ciRows = document.getElementById("ci_rows");

  rgxAddButton.addEventListener("click", function () {
    generateFilterItems("rgx", useRegexCheck.checked, rgxRows);
  });

  csAddButton.addEventListener("click", function () {
    generateFilterItems("cs", useCsCheck.checked, csRows);
  });

  ciAddButton.addEventListener("click", function () {
    generateFilterItems("ci", useCiCheck.checked, ciRows);
  });
}

function selectItemFromDropdown(type) {
  let dropdownButton = document.getElementById(`${type}_button`);
  let dropdownMenu = document.getElementById(`${type}_menu`);
  let dropdownItems = dropdownMenu.querySelectorAll(".dropdown-item");

  dropdownItems.forEach((item) => {
    item.addEventListener("click", function () {
      dropdownButton.textContent = item.textContent; // Set button text to the selected item
      dropdownButton.setAttribute("aria-expanded", "false"); // Close the dropdown
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  handleAddButtonClick();
  selectItemFromDropdown("block_rec_start_item");
  selectItemFromDropdown("block_rec_end_item");
  // var workersConnDropdownItems = document.querySelectorAll('[name="workers_conn_item"]');
  // workersConnDropdownItems.forEach(function(item) {
  //     item.addEventListener("click", function(event) {
  //         event.preventDefault(); // Prevent default link behavior
  //         selectedWorkerConn = item.getAttribute("id"); // Store the selected ID
  //     });
  // });
  saveWorkerConfig();
  var filterpriorities = [];
});

function onModeChange(value) {
  // let modeSelected = oEvent.value;
  if (value === "LIVE") {
    document.getElementById("mode_state_until").disabled = true;
    document.getElementById("mode_state_from").disabled = true;
  } else {
    document.getElementById("mode_state_until").disabled = false;
    document.getElementById("mode_state_from").disabled = false;
  }
}

function collectFormDataForConnConfig() {
  let connConfig = {};
  // Collecting connection from_to
  source_channel = document.getElementById("src_input").value;
  target_channel = document.getElementById("dst_input").value;
  from_to = {};
  from_to["from"] = source_channel;
  from_to["to"] = target_channel;
  connConfig["from_to"] = from_to;

  // Collecting added filers
  filterItems = {};
  filterTypes = ["rgx", "cs", "ci"];
  filterTypes.forEach((type) => {
    numberOfAddedRows = document.getElementById(
      `${type}_rows`
    ).childElementCount;
    if (numberOfAddedRows > 0) {
      numberOfAddedItems =
        (numberOfAddedRows - 1) * 3 +
        document.getElementById(`${type}_row${numberOfAddedRows}`)
          .childElementCount;
      typeItems = {};
      for (let i = 1; i <= numberOfAddedItems; i++) {
        let item = document.getElementById(`${type}${i}_input`).value;
        if (item) {
          typeItems[`${type.toUpperCase()}${i}`] = item;
        }
      }
      filterItems[type] = typeItems;
    }
  });
  connConfig["filters"] = filterItems;
  workerSettings = {};
  // Collecting mode settings
  modeSettings = {};
  if (document.getElementById("mode_state_live").checked) {
    modeSettings["mode"] = "LIVE";
  } else {
    modeSettings["mode"] = "PAST";
    modeSettings["from"] = document.getElementById("mode_state_from").value;
    modeSettings["until"] = document.getElementById("mode_state_until").value;
  }
  blockSettings = {};
  if (document.getElementById("block_rec_check").checked) {
    modeSettings["block"] = true;
    modeSettings["block_rec_start"] = document.getElementById(
      "block_rec_start_item_button"
    ).textContent;
    modeSettings["block_rec_end"] = document.getElementById(
      "block_rec_end_item_button"
    ).textContent;
  } else {
    modeSettings["block"] = false;
  }
  if (document.getElementById("save_log_check").checked) {
    modeSettings["block_save_log"] = true;
  } else {
    modeSettings["block_save_log"] = false;
  }
  runState = {};
  if (document.getElementById("run_state_infinite").checked) {
    runState["run"] = "INFINITE";
  } else {
    runState["run"] = "RUN_UNTILL";
    runState["days"] = document.getElementById("run_state_set_days").value;
    runState["hours"] = document.getElementById("run_state_set_hours").value;
    runState["minutes"] = document.getElementById(
      "run_state_set_minutes"
    ).value;
  }
  workerSettings["mode"] = modeSettings;
  workerSettings["block"] = blockSettings;
  workerSettings["run_state"] = runState;
  connConfig["worker_settings"] = workerSettings;
  return connConfig;
}

function saveWorkerConfig() {
  const path = window.location.pathname;
  if (path === "/workers") {
    var selectedId = null; // Variable to store the selected ID
    // Add click event listeners to the dropdown items
    var dropdownItems = document.querySelectorAll('[name="workers_conn_item"]');
    dropdownItems.forEach(function (item) {
      item.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default link behavior
        selectedId = item.getAttribute("id"); // Store the selected ID
      });
    });

    // Add a click event listener to the "Save changes" button
    var saveChangesButton = document.getElementById("save_worker_settings");
    saveChangesButton.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default button behavior

      // Check if a connection is selected
      if (selectedId) {
        var formData = new FormData(); // Create a new FormData object
        var formDataForConnConfig = collectFormDataForConnConfig(); // Use the form's ID to get the form data
        formData.append(
          "filters",
          JSON.stringify(formDataForConnConfig.filters)
        );
        formData.append(
          "from_to",
          JSON.stringify(formDataForConnConfig.from_to)
        );
        formData.append(
          "worker_settings",
          JSON.stringify(formDataForConnConfig.worker_settings)
        );
        formData.append("connection_id", selectedId);
        // Send the data to "/updateConnection" with the selected ID as a parameter
        fetch(`/saveWorkerConfig?connection_id=${selectedId}`, {
          method: "POST", // You can use the appropriate HTTP method (GET, POST, etc.)
          body: formData, // Use the form's ID to get the form data
        })
          .then(function (response) {
            if (!response.ok) {
              throw new Error("Network response was not ok");
              message = {
                message: {
                  category: "danger",
                  text: "Network response was not ok",
                },
              };
              showFlashedMessages(message);
            }
            // Handle successful response (if needed)
            console.log("Data sent successfully!");
            message = {
              message: { category: "success", text: "Data sent successfully!" },
            };
            showFlashedMessages(message);
            return response.json();
          })
          .then(function (data) {
            // Handle the response data here
            showFlashedMessages(data);
            document.querySelector('[name="conn_date"]').value = formatDate(
              data.message.last_modified
            );
            getListOfConnections().then(function (connectionsList) {
              console.log("List of connections used in the code:");
              console.log(connectionsList);
              // Update the connection list in the dropdown menu
              updateConnectionList(connectionsList);
            });
          })
          .catch(function (error) {
            // Handle errors here
            console.error("Fetch Error:", error);
          });
      } else {
        // Show an error message or perform other actions if no connection is selected
        console.log("Please select a connection first.");
        message = {
          message: {
            category: "danger",
            text: "Please select a connection first.",
          },
        };
        showFlashedMessages(message);
      }
    });
  }
}
