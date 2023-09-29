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
	let prioritiesdropdownList = prioritytabContents.getElementsByClassName("dropdown-menu");
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

function handleAddRuleClick(event) {
	let buttonId = this.getAttribute("id");
	let buttonIdRegexPattern = /add_(\w+)(\d+)_button/;
	let match = buttonIdRegexPattern.exec(buttonId);
	if (match) {
		// match[1] contains the 'type' value (e.g., 'rgx')
		var type = match[1];

		// match[2] contains the 'inputId' value (e.g., '1')
		var inputId = match[2];
		let addRulePermitted = undefined;
		let ruleItemsContainer = document.getElementById(`items_${type}${inputId}`);
		let numberOfAddedRules = ruleItemsContainer.childElementCount - 2;
		let addedRules = undefined;
		if (numberOfAddedRules > 0) {
			AddedRuleDivs = ruleItemsContainer.querySelectorAll(`[name="rule_div"]`);
			if (AddedRuleDivs.length > 0) {
				addedRules = Array.from(AddedRuleDivs).map((div) => {
					return div.querySelector("select").value;
				});
				if (addedRules.includes("0") || addedRules.includes("1") || addedRules.includes("2")) {
					showFlashedMessages({ message: { category: "danger", text: "Please select a rule for the previous rule." } });
					addRulePermitted = false;
				} else {
					addRulePermitted = true;
				}
			} else {
				showFlashedMessages({ message: { category: "danger", text: "Internal error, please refresh the page and try again." } });
				addRulePermitted = true;
			}
		} else {
			addRulePermitted = true;
		}
		if (addRulePermitted) {
			let ruleDiv = document.createElement("div");
			ruleDiv.id = `${type}${inputId}_rule_row${numberOfAddedRules + 1}`;
			ruleDiv.setAttribute("name", "rule_div");
			ruleDiv.className = "d-flex";
			ruleDiv.style.paddingTop = "5px";
			ruleDiv.style.paddingBottom = "5px";
			let delRuleButton = document.createElement("button");
			delRuleButton.id = `${type}${inputId}_rule_row${numberOfAddedRules + 1}_del_rule`;
			delRuleButton.className = "btn btn-danger btn-sm";
			delRuleButton.type = "button";
			delRuleButton.style.marginRight = "10px";
			delRuleButton.style.marginLeft = "10px";
			delRuleButton.innerHTML = `
          <svg class="bi bi-dash-lg fs-4" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
            fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
              d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z">
            </path>
          </svg>
        `;
			delRuleButton.addEventListener("click", handleDeleteRuleClick);
			let selectRuleDiv = document.createElement("div");
			selectRuleDiv.id = `${type}${inputId}_rule_row${numberOfAddedRules + 1}_select_rule`;
			selectRuleDiv.className = "dropdown show";
			selectRuleDiv.style.marginRight = "10px";
			let selectRule = document.createElement("select");
			selectRule.id = `${type}${inputId}_rule${numberOfAddedRules + 1}_select_rule`;
			selectRule.className = "form-select form-select-sm";
			selectRule.style.background = "rgb(55,99,244)";
			selectRule.style.color = "var(--bs-body-bg)";
			selectRule.style.fontSize = "20px";
			selectRule.style.width = "250px";
			selectRule.style.textAlign = "center";
			selectRule.style.paddingRight = "0px";
			selectRule.style.paddingLeft = "0px";
			selectRule.value = "0";
			selectRule.setAttribute("previousValue", "0");
			selectRule.name = "select_rule";
			let selectRuleOptGroup = document.createElement("optgroup");
			selectRuleOptGroup.label = "Select a rule:";
			let selectRuleOptions = [];
			let selectRuleOptionTexts = [
				"NONE",
				"DELETE FULL ENTRY",
				"DELETE KEYWORD",
				"INSERT BEFORE",
				"INSERT AFTER",
				"REPLACE WITH",
				"STRIP WHITESPACES",
				"STRIP OTHER",
				"TO UPPERCASE",
				"TO LOWERCASE",
			];
			selectRuleOptionTexts.forEach((text, index) => {
				let selectRuleOption = document.createElement("option");
				selectRuleOption.value = index;
				selectRuleOption.textContent = text;
				selectRuleOptions.push(selectRuleOption);
				if (addedRules) {
					if (addedRules.includes(`${index}` || addedRules.includes("1") || addedRules.includes("2"))) {
						selectRuleOption.disabled = true;
					}
					if ((index === 9 && addedRules.includes("8")) || (index === 8 && addedRules.includes("9"))) {
						selectRuleOption.disabled = true;
					}
				}
			});
			selectRuleOptions.forEach((option) => selectRuleOptGroup.appendChild(option));
			selectRule.appendChild(selectRuleOptGroup);
			selectRule.addEventListener("change", handleSelectRuleChange);
			selectRuleDiv.appendChild(selectRule);
			let ruleInput = document.createElement("input");
			ruleInput.id = `${type}${inputId}_rule_row${numberOfAddedRules + 1}_input`;
			ruleInput.className = "form-control";
			ruleInput.type = "text";
			ruleInput.style.marginRight = "10px";
			// set input to disabled
			ruleInput.disabled = true;
			ruleDiv.appendChild(delRuleButton);
			ruleDiv.appendChild(selectRuleDiv);
			ruleDiv.appendChild(ruleInput);
			ruleItemsContainer.appendChild(ruleDiv);
			addedRules = collectAddedRules(type, inputId);
			updateDisabledSelectOptions(type, inputId, addedRules);
		}
	} else {
		showFlashedMessages({ message: { category: "danger", text: "Internal error, please refresh the page and try again." } });
	}
}

function handleAddRule(type, inputId) {
	let addRulePermitted = undefined;
	let ruleItemsContainer = document.getElementById(`items_${type}${inputId}`);
	let numberOfAddedRules = ruleItemsContainer.childElementCount - 2;
	let addedRules = undefined;
	if (numberOfAddedRules > 0) {
		AddedRuleDivs = ruleItemsContainer.querySelectorAll(`[name="rule_div"]`);
		if (AddedRuleDivs.length > 0) {
			addedRules = Array.from(AddedRuleDivs).map((div) => {
				return div.querySelector("select").value;
			});
			if (addedRules.includes("0") || addedRules.includes("1") || addedRules.includes("2")) {
				showFlashedMessages({ message: { category: "danger", text: "Please select a rule for the previous rule." } });
				addRulePermitted = false;
			} else {
				addRulePermitted = true;
			}
		} else {
			showFlashedMessages({ message: { category: "danger", text: "Internal error, please refresh the page and try again." } });
			addRulePermitted = true;
		}
	} else {
		addRulePermitted = true;
	}
	if (addRulePermitted) {
		let ruleDiv = document.createElement("div");
		ruleDiv.id = `${type}${inputId}_rule_row${numberOfAddedRules + 1}`;
		ruleDiv.setAttribute("name", "rule_div");
		ruleDiv.className = "d-flex";
		ruleDiv.style.paddingTop = "5px";
		ruleDiv.style.paddingBottom = "5px";
		let delRuleButton = document.createElement("button");
		delRuleButton.id = `${type}${inputId}_rule_row${numberOfAddedRules + 1}_del_rule`;
		delRuleButton.className = "btn btn-danger btn-sm";
		delRuleButton.type = "button";
		delRuleButton.style.marginRight = "10px";
		delRuleButton.style.marginLeft = "10px";
		delRuleButton.innerHTML = `
								<svg class="bi bi-dash-lg fs-4" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
									fill="currentColor" viewBox="0 0 16 16">
									<path fill-rule="evenodd"
									d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z">
									</path>
								</svg>
								`;
		delRuleButton.addEventListener("click", handleDeleteRuleClick);
		let selectRuleDiv = document.createElement("div");
		selectRuleDiv.id = `${type}${inputId}_rule_row${numberOfAddedRules + 1}_select_rule`;
		selectRuleDiv.className = "dropdown show";
		selectRuleDiv.style.marginRight = "10px";
		let selectRule = document.createElement("select");
		selectRule.id = `${type}${inputId}_rule${numberOfAddedRules + 1}_select_rule`;
		selectRule.className = "form-select form-select-sm";
		selectRule.style.background = "rgb(55,99,244)";
		selectRule.style.color = "var(--bs-body-bg)";
		selectRule.style.fontSize = "20px";
		selectRule.style.width = "250px";
		selectRule.style.textAlign = "center";
		selectRule.style.paddingRight = "0px";
		selectRule.style.paddingLeft = "0px";
		selectRule.value = "0";
		selectRule.setAttribute("previousValue", "0");
		selectRule.name = "select_rule";
		let selectRuleOptGroup = document.createElement("optgroup");
		selectRuleOptGroup.label = "Select a rule:";
		let selectRuleOptions = [];
		let selectRuleOptionTexts = [
			"NONE",
			"DELETE FULL ENTRY",
			"DELETE KEYWORD",
			"INSERT BEFORE",
			"INSERT AFTER",
			"REPLACE WITH",
			"STRIP WHITESPACES",
			"STRIP OTHER",
			"TO UPPERCASE",
			"TO LOWERCASE",
		];
		selectRuleOptionTexts.forEach((text, index) => {
			let selectRuleOption = document.createElement("option");
			selectRuleOption.value = index;
			selectRuleOption.textContent = text;
			selectRuleOptions.push(selectRuleOption);
			if (addedRules) {
				if (addedRules.includes(`${index}` || addedRules.includes("1") || addedRules.includes("2"))) {
					selectRuleOption.disabled = true;
				}
				if ((index === 9 && addedRules.includes("8")) || (index === 8 && addedRules.includes("9"))) {
					selectRuleOption.disabled = true;
				}
			}
		});
		selectRuleOptions.forEach((option) => selectRuleOptGroup.appendChild(option));
		selectRule.appendChild(selectRuleOptGroup);
		selectRule.addEventListener("change", handleSelectRuleChange);
		selectRuleDiv.appendChild(selectRule);
		let ruleInput = document.createElement("input");
		ruleInput.id = `${type}${inputId}_rule_row${numberOfAddedRules + 1}_input`;
		ruleInput.className = "form-control";
		ruleInput.type = "text";
		ruleInput.style.marginRight = "10px";
		// set input to disabled
		ruleInput.disabled = true;
		ruleDiv.appendChild(delRuleButton);
		ruleDiv.appendChild(selectRuleDiv);
		ruleDiv.appendChild(ruleInput);
		ruleItemsContainer.appendChild(ruleDiv);
		addedRules = collectAddedRules(type, inputId);
		updateDisabledSelectOptions(type, inputId, addedRules);
	}
}

function handleDeleteRuleClick() {
	let buttonId = this.getAttribute("id");

	// Regular expression pattern to match the desired format
	let pattern = /^([a-zA-Z]+)(\d+)_rule_row(\d+)_del_rule$/;

	// Use the `match` method to extract the values
	let matchResult = buttonId.match(pattern);

	if (matchResult) {
		// Extract the values from the match result
		let type = matchResult[1];
		let inputId = matchResult[2];
		let ruleId = matchResult[3];

		let addedRules = collectAddedRules(type, inputId);

		// remove element with index (ruleId-1) from the array
		addedRules.splice(ruleId - 1, 1);
		deleteAllRules(type, inputId);
		batchAddRules(type, inputId, addedRules);
		updateDisabledSelectOptions(type, inputId, addedRules);
	} else {
		showFlashedMessages({ message: { category: "danger", text: "Internal error, please refresh the page and try again." } });
	}
}

function handleSelectRuleChange() {
	let selectRuleOptionTexts = [
		"NONE",
		"DELETE FULL ENTRY",
		"DELETE KEYWORD",
		"INSERT BEFORE",
		"INSERT AFTER",
		"REPLACE WITH",
		"STRIP WHITESPACES",
		"STRIP OTHER",
		"TO UPPERCASE",
		"TO LOWERCASE",
	];
	let selectId = this.getAttribute("id");
	let selectValue = this.value;
	let previousValue = this.getAttribute("previousValue");

	// Define a regular expression pattern to match the desired format
	let regexPattern = /^([a-zA-Z]+)(\d+)_rule(\d+)_select_rule$/;

	// Use the `match` method with the regex pattern
	let matches = selectId.match(regexPattern);

	if (matches) {
		// Extract the values from the matched groups
		let type = matches[1];
		let inputId = matches[2];
		let ruleIndex = matches[3];
		let addedRules = collectAddedRules(type, inputId);

		if (!(selectValue === previousValue)) {
			document.getElementById(`${type}${inputId}_rule_row${ruleIndex}_input`).value = "";
		}

		if ((selectValue === "1" || selectValue === "2") && addedRules.length > 1) {
			if (window.confirm(`The rule ${selectRuleOptionTexts[selectValue]} will void other rules, are you sure you want to continue?`)) {
				// User clicked OK, handle accordingly
				deleteAllRules(type, inputId);
				batchAddRules(type, inputId, [selectValue]);
				this.setAttribute("previousValue", selectValue);
			} else {
				// User clicked Cancel, handle accordingly
				this.value = previousValue;
			}
		} else {
			this.setAttribute("previousValue", selectValue);
			if ([3, 4, 5, 7].includes(parseInt(selectValue))) {
				document.getElementById(`${type}${inputId}_rule_row${ruleIndex}_input`).disabled = false;
			} else {
				document.getElementById(`${type}${inputId}_rule_row${ruleIndex}_input`).disabled = true;
			}
		}
		addedRules = collectAddedRules(type, inputId);
		updateDisabledSelectOptions(type, inputId, addedRules);
	} else {
		showFlashedMessages({ message: { category: "danger", text: "Internal error, please refresh the page and try again." } });
	}
}
function updateDisabledSelectOptions(type, inputId, addedRules) {
	let ruleItemsContainer = document.getElementById(`items_${type}${inputId}`);
	let selectRules = ruleItemsContainer.querySelectorAll(`[name="select_rule"]`);
	if (selectRules.length > 0) {
		selectRules.forEach((select) => {
			let selectOptions = select.querySelectorAll("option");
			if (selectOptions.length > 0) {
				selectOptions.forEach((option) => {
					if (addedRules.includes(option.value)) {
						option.disabled = true;
					} else {
						option.disabled = false;
					}
				});
			}
		});
	} else {
		showFlashedMessages({ message: { category: "danger", text: "Internal error, please refresh the page and try again." } });
	}
}
function collectAddedRules(type, inputId) {
	let addedRules = [];
	let ruleItemsContainer = document.getElementById(`items_${type}${inputId}`);
	let numberOfAddedRules = ruleItemsContainer.childElementCount - 2;
	if (numberOfAddedRules > 0) {
		AddedselectRules = ruleItemsContainer.querySelectorAll(`[name="select_rule"]`);
		if (AddedselectRules.length > 0) {
			addedRules = Array.from(AddedselectRules).map((select) => {
				return select.value;
			});
		} else {
			showFlashedMessages({ message: { category: "danger", text: "Internal error, please refresh the page and try again." } });
		}
	} else {
		showFlashedMessages({ message: { category: "danger", text: "Internal error, please refresh the page and try again." } });
	}
	return addedRules;
}

function deleteAllRules(type, inputId) {
	let ruleItemsContainer = document.getElementById(`items_${type}${inputId}`);
	let numberOfAddedRules = ruleItemsContainer.childElementCount - 2;
	if (numberOfAddedRules > 0) {
		AddedRuleDivs = ruleItemsContainer.querySelectorAll(`[name="rule_div"]`);
		if (AddedRuleDivs.length > 0) {
			AddedRuleDivs.forEach((div) => {
				div.remove();
			});
		}
	}
}

function batchAddRules(type, inputId, rules) {
	let ruleItemsContainer = document.getElementById(`items_${type}${inputId}`);
	let numberOfAddedRules = ruleItemsContainer.childElementCount - 2;
	rules.forEach((index) => {
		let ruleDiv = document.createElement("div");
		ruleDiv.id = `${type}${inputId}_rule_row${numberOfAddedRules + 1}`;
		ruleDiv.setAttribute("name", "rule_div");
		ruleDiv.className = "d-flex";
		ruleDiv.style.paddingTop = "5px";
		ruleDiv.style.paddingBottom = "5px";
		let delRuleButton = document.createElement("button");
		delRuleButton.id = `${type}${inputId}_rule_row${numberOfAddedRules + 1}_del_rule`;
		delRuleButton.className = "btn btn-danger btn-sm";
		delRuleButton.type = "button";
		delRuleButton.style.marginRight = "10px";
		delRuleButton.style.marginLeft = "10px";
		delRuleButton.innerHTML = `
          <svg class="bi bi-dash-lg fs-4" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
            fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
              d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z">
            </path>
          </svg>
        `;
		delRuleButton.addEventListener("click", handleDeleteRuleClick);
		let selectRuleDiv = document.createElement("div");
		selectRuleDiv.id = `${type}${inputId}_rule_row${numberOfAddedRules + 1}_select_rule`;
		selectRuleDiv.className = "dropdown show";
		selectRuleDiv.style.marginRight = "10px";
		let selectRule = document.createElement("select");
		selectRule.id = `${type}${inputId}_rule${numberOfAddedRules + 1}_select_rule`;
		selectRule.className = "form-select form-select-sm";
		selectRule.style.background = "rgb(55,99,244)";
		selectRule.style.color = "var(--bs-body-bg)";
		selectRule.style.fontSize = "20px";
		selectRule.style.width = "250px";
		selectRule.style.textAlign = "center";
		selectRule.style.paddingRight = "0px";
		selectRule.style.paddingLeft = "0px";
		selectRule.value = index;
		selectRule.name = "select_rule";
		selectRule.setAttribute("previousValue", index);
		let selectRuleOptGroup = document.createElement("optgroup");
		selectRuleOptGroup.label = "Select a rule:";
		let selectRuleOptions = [];
		let selectRuleOptionTexts = [
			"NONE",
			"DELETE FULL ENTRY",
			"DELETE KEYWORD",
			"INSERT BEFORE",
			"INSERT AFTER",
			"REPLACE WITH",
			"STRIP WHITESPACES",
			"STRIP OTHER",
			"TO UPPERCASE",
			"TO LOWERCASE",
		];
		selectRuleOptionTexts.forEach((text, selectIndex) => {
			let selectRuleOption = document.createElement("option");
			selectRuleOption.value = selectIndex;
			selectRuleOption.textContent = text;
			selectRuleOptions.push(selectRuleOption);
			if (index === `${selectIndex}`) {
				selectRuleOption.selected = true;
			}
			if (`${selectIndex}` !== index && rules.includes(`${selectIndex}`)) {
				selectRuleOption.disabled = true;
			}
		});
		selectRuleOptions.forEach((option) => selectRuleOptGroup.appendChild(option));
		selectRule.appendChild(selectRuleOptGroup);
		selectRule.addEventListener("change", handleSelectRuleChange);
		selectRuleDiv.appendChild(selectRule);
		let ruleInput = document.createElement("input");
		ruleInput.id = `${type}${inputId}_rule_row${numberOfAddedRules + 1}_input`;
		ruleInput.className = "form-control";
		ruleInput.type = "text";
		ruleInput.style.marginRight = "10px";
		ruleInput.disabled = true;
		ruleDiv.appendChild(delRuleButton);
		ruleDiv.appendChild(selectRuleDiv);
		ruleDiv.appendChild(ruleInput);
		ruleItemsContainer.appendChild(ruleDiv);
		numberOfAddedRules++;
	});
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

	// Create a new tab content
	let newTabContent = document.createElement("div");
	newTabContent.id = `items_${type}${inputId}`;
	newTabContent.className = "tab-pane";
	newTabContent.role = "tabpanel";

	if (tabItemsContainer.childElementCount === 0 && tabContentContainer.childElementCount === 0) {
		// Set this tab to active
		newTabLink.className = "nav-link active";
		newTabContent.className = "tab-pane active";
	}

	newTab.appendChild(newTabLink);
	tabItemsContainer.appendChild(newTab);

	// Create a new row
	let row1 = document.createElement("div");
	row1.className = "row, d-flex";
	row1.style.paddingTop = "5px";
	row1.style.paddingBottom = "5px";
	row1.style.marginLeft = "10px";
	row1.style.marginTop = "10px";

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

	// col.appendChild(dropdown);

	// Replace dropdown with select
	// <select id="rgx1_priority" class="form-select form-select-sm" style="background: rgb(55,99,244);color: var(--bs-body-bg);font-size: 20px;width: 100%;text-align: center;padding-right: 0px;padding-left: 0px;" value="NONE" name="select_rule">
	// 	<optgroup label="Select a rule:">
	// 		<option value="0" selected>Select a priority :</option>
	// 		<option value="1">1</option>
	// 		<option value="2">2</option>
	// 		<option value="3">3</option>
	// 		<option value="4">4</option>
	// 		<option value="5">5</option>
	// 		<option value="6">6</option>
	// 	</optgroup>
	// </select>
	let select = document.createElement("select");
	select.id = `${type}${inputId}_priority`;
	select.className = "form-select form-select-sm";
	select.style.background = "rgb(55,99,244)";
	select.style.color = "var(--bs-body-bg)";
	select.style.fontSize = "20px";
	select.style.width = "100%";
	select.style.textAlign = "center";
	select.style.paddingRight = "0px";
	select.style.paddingLeft = "0px";
	select.value = "NONE";
	select.name = "select_priority";
	let selectOptGroup = document.createElement("optgroup");
	selectOptGroup.label = "Select a priority:";
	// let selectOptions = [];
	// let selectOptionTexts = [];
	// for (let i = 1; i <= parseInt(calculateNumberOfFilterKeys()); i++) {
	// 	selectOptionTexts.push(`${i}`);
	// }
	// selectOptionTexts.forEach((text, index) => {
	// 	let selectOption = document.createElement("option");
	// 	selectOption.value = index;
	// 	selectOption.textContent = `Selected priority: ${text}`;
	// 	selectOptions.push(selectOption);
	// });
	// selectOptions.forEach((option) => selectOptGroup.appendChild(option));
	select.appendChild(selectOptGroup);
	select.value = 0;
	select.addEventListener("change", handleSelectPriorityChange);
	col.appendChild(select);

	row1.appendChild(col);

	newTabContent.appendChild(row1);

	// Create a new row
	let row2 = document.createElement("div");
	row2.className = "row, d-flex";
	row2.style.paddingTop = "5px";
	row2.style.paddingBottom = "5px";
	row2.style.marginLeft = "10px";

	// Create a new column
	let col2 = document.createElement("div");
	col2.className = "col";

	// Create a new button
	let addButton = document.createElement("button");
	addButton.id = `add_${type}${inputId}_button`;
	addButton.className = "btn btn-primary d-flex justify-content-between align-items-center align-content-center";
	addButton.type = "button";
	addButton.style.width = "190px";

	addButton.innerHTML = `
        <span>ADD Rule</span>
        <svg class="bi bi-plus-square-dotted fs-4" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
          <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"></path>
        </svg>
      `;
	addButton.addEventListener("click", handleAddRuleClick);
	// Add button2 to col2
	col2.appendChild(addButton);

	// Add col2 to row2
	row2.appendChild(col2);

	// Add row2 to container
	newTabContent.appendChild(row2);

	// Add tab content to the tabContent container
	tabContentContainer.appendChild(newTabContent);

	updatePrioritySelects();
}

function handleSelectPriorityChange() {
	let selectId = this.getAttribute("id");
	let selectValue = this.value;
	let selects = document.querySelectorAll(`[name="select_priority"]`);
	if (selects.length > 0) {
		selects.forEach((select) => {
			if (selectId !== select.getAttribute("id")) {
				optgroup = select.querySelector("optgroup");
				if (!(selectValue === "0")) {
					// disable the option with value = selectValue
					optgroup.querySelector(`#priority_${select.id}_option${selectValue}`).disabled = true;
				}
			}
		});
	}
}

function updatePrioritySelects() {
	let selects = document.querySelectorAll(`[name="select_priority"]`);
	if (selects.length > 0) {
		numberOfSelects = selects.length;
		// Replace the options in optgroup to match the number of filter keys as follows:
		// 		<option value="1">`Selected priority : ${i}`</option>
		// where 0<i<=numberOfSelects
		selects.forEach((select) => {
			selectValue = select.value;
			let selectOptGroup = select.querySelector("optgroup");
			if (selectOptGroup) {
				selectOptGroup.innerHTML = "";
				for (let i = 0; i <= numberOfSelects; i++) {
					let selectOption = document.createElement("option");
					selectOption.value = i;
					if (i === 0) {
						selectOption.textContent = "Select a priority :";
					}else{
						selectOption.textContent = `Selected priority : ${i}`;
					}
					selectOption.id = `priority_${select.id}_option${i}`;
					selectOptGroup.appendChild(selectOption);
				}
			}
			if (selectValue) {
				select.value = selectValue;
			}else{
				select.value = 0;
			}
		});
	}
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
              <input id="${type}${currentRow + 1}_input" class="form-control" type="text" />
            </div>
          </div>
        `;
			newCol.id = `${type}_row${currentRow + 1}_col${1}`;
			newRow.appendChild(newCol);
		} else {
			currentRow = rows.childElementCount;
			currentColumn = rows.lastElementChild.childElementCount;
			// if the value of the input in the last column is empty, do not add a new column
			if (document.getElementById(`${type}${(currentRow - 1) * 3 + currentColumn}_input`).value != "") {
				if (currentColumn < 3) {
					inputId = `${(currentRow - 1) * 3 + currentColumn + 1}`;
					inputName = `${type.toUpperCase()}${(currentRow - 1) * 3 + currentColumn + 1}`;
					// Add first column of three columns
					let newCol = document.createElement("div");
					newCol.className = "col col-4";
					newCol.innerHTML = `
            <div class="row">
              <label class="form-label col-sm-3 col-form-label">${type.toUpperCase()}${(currentRow - 1) * 3 + currentColumn + 1}</label>
              <div class="col-sm-9">
                <input id="${type}${(currentRow - 1) * 3 + currentColumn + 1}_input" class="form-control" type="text" />
              </div>
            </div>
            `;
					newCol.id = `${type}_row${currentRow}_col${currentColumn + 1}`;
					rows.lastElementChild.appendChild(newCol);
				} else {
					inputId = `${(currentRow - 1) * 3 + currentColumn + 1}`;
					inputName = `${type.toUpperCase()}${(currentRow - 1) * 3 + currentColumn + 1}`;
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
              <label class="form-label col-sm-3 col-form-label">${type.toUpperCase()}${(currentRow - 1) * 3 + currentColumn + 1}</label>
              <div class="col-sm-9">
                <input id="${type}${(currentRow - 1) * 3 + currentColumn + 1}_input" class="form-control" type="text" />
              </div>
            </div>
            `;
					newCol.id = `${type}_row${currentRow + 1}_col${1}`;
					newRow.appendChild(newCol);
				}
			}
		}
		document.getElementById(`${type}${inputId}_input`).addEventListener("change", onInputChange);
	}
}

function onInputChange(oEvent) {
	const strId = this.getAttribute("Id");
	let oIdNum = strId.match(/[0-9]+/);
	let inputId = parseInt(oIdNum[0]);
	let type = strId.substring(0, oIdNum.index);
	let inputNotEmpty = this.value.trim() ? true : false;
	let prevInput = document.getElementById(`${type}${inputId - 1}_input`);
	let prevInputTabExists = document.getElementById(`${type}${inputId - 1}_tab`) ? true : false;
	let nextInput = document.getElementById(`${type}${inputId + 1}_input`);
	let nextInputTabExists = document.getElementById(`${type}${inputId + 1}_tab`) ? true : false;
	let tabExists = document.getElementById(`${type}${inputId}_tab`) ? true : false;
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
	let source_channel = document.getElementById("src_input").value;
	let target_channel = document.getElementById("dst_input").value;
	let from_to = {};
	from_to["from"] = source_channel;
	from_to["to"] = target_channel;
	connConfig["from_to"] = from_to;

	// Collecting added filers
	let filterItems = {};
	let filterTypes = ["rgx", "cs", "ci"];
	let rgxFilters = [];
	let csFilters = [];
	let ciFilters = [];
	filterTypes.forEach((type) => {
		let numberOfAddedRows = document.getElementById(`${type}_rows`).childElementCount;
		if (numberOfAddedRows > 0) {
			numberOfAddedItems = (numberOfAddedRows - 1) * 3 + document.getElementById(`${type}_row${numberOfAddedRows}`).childElementCount;
			items = [];
			for (let i = 1; i <= numberOfAddedItems; i++) {
				let item = {};
				itemKeyValues = {};
				itemValue = document.getElementById(`${type}${i}_input`).value;
				if (itemValue && !(itemValue == "")) {
					let itemFilterTab = document.getElementById(`items_${type}${i}`);
					if (itemFilterTab) {
						let numberOfAddedItemFilters = itemFilterTab.childElementCount - 2;
						if (numberOfAddedItemFilters > 0) {
							let itemFilters = [];
							for (let j = 1; j <= numberOfAddedItemFilters; j++) {
								let filterItemKeyValue = {};
								let filterItemKey = document.getElementById(`${type}${i}_rule${j}_select_rule`).value;
								if (filterItemKey && !(filterItemKey == "0")) {
									let filterItemValue = document.getElementById(`${type}${i}_rule_row${j}_input`).value;
									filterItemKeyValue[filterItemKey] = filterItemValue;
								}
								if (Object.keys(filterItemKeyValue).length > 0)
									itemFilters.push(filterItemKeyValue);
							}
							if (itemFilters.length > 0)
								itemKeyValues[itemValue] = itemFilters;
						}
					}
				}
				if (Object.keys(itemKeyValues).length > 0)
					item["value"] = itemKeyValues;
					item["priority"] = document.getElementById(`${type}${i}_priority`).value;
					items.push(item);
					// items.push(itemKeyValues);
				itemValue = "";
			}
			if (type === "rgx") rgxFilters = items;
			if (type === "cs") csFilters = items;
			if (type === "ci") ciFilters = items;
		}
	});
	filterItems["rgx"] = rgxFilters;
	filterItems["cs"] = csFilters;
	filterItems["ci"] = ciFilters;
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
		modeSettings["block_rec_start"] = document.getElementById("block_rec_start_item_button").textContent;
		modeSettings["block_rec_end"] = document.getElementById("block_rec_end_item_button").textContent;
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
		runState["minutes"] = document.getElementById("run_state_set_minutes").value;
	}
	workerSettings["mode"] = modeSettings;
	workerSettings["block"] = blockSettings;
	workerSettings["run_state"] = runState;
	connConfig["worker_settings"] = workerSettings;
	return connConfig;
}

function clearWorkerConfig() {
	// Collecting connection from_to
	document.getElementById("src_input").value = "";
	document.getElementById("dst_input").value = "";
	let filterTypes = ["rgx", "cs", "ci"];
	filterTypes.forEach((type) => {
		typeRows = document.getElementById(`${type}_rows`);
		if (type === "rgx") {
			document.getElementById("use_regex_check").checked = false;
		}
		if (type === "cs") {
			document.getElementById("use_cs_check").checked = false;
		}
		if (type === "ci") {
			document.getElementById("use_ci_check").checked = false;
		}
		while (typeRows.firstChild) {
			typeRows.removeChild(typeRows.lastChild);
		}
		refactorRulesTabs = document.getElementById("items_tab_items");
		while (refactorRulesTabs.firstChild) {
			refactorRulesTabs.removeChild(refactorRulesTabs.lastChild);
		}
		refactorRulesContents = document.getElementById("items_tab_content");
		while (refactorRulesContents.firstChild) {
			refactorRulesContents.removeChild(refactorRulesContents.lastChild);
		}
	});
	// Resetting mode settings
	document.getElementById("mode_state_live").checked = true;
	document.getElementById("mode_state_until").disabled = true;
	document.getElementById("mode_state_from").disabled = true;
	document.getElementById("block_rec_check").checked = false;
	document.getElementById("save_log_check").checked = false;
	document.getElementById("block_rec_start_item_button").textContent = "Select a rule";
	document.getElementById("block_rec_end_item_button").textContent = "Select a rule";
	document.getElementById("run_state_infinite").checked = true;
	document.getElementById("run_state_set_days").disabled = true;
	document.getElementById("run_state_set_hours").disabled = true;
	document.getElementById("run_state_set_minutes").disabled = true;
	document.getElementById("run_state_set_days").value = "";
	document.getElementById("run_state_set_hours").value = "";
	document.getElementById("run_state_set_minutes").value = "";
}

function loadWorkerConfigForConn(conn_id) {
	// Send the data to "/updateConnection" with the selected ID as a parameter
	fetch(`/loadWorkerConfig?connection_id=${conn_id}`, {
		method: "GET", // You can use the appropriate HTTP method (GET, POST, etc.)
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
			return response.json();
		})
		.then(function (data) {
			success = data["success"];
			if (success) {
				// Clearing the form
				clearWorkerConfig();
				config = data["config"];
				// Collecting connection from_to
				let from_to = config["from_to"];
				let source_channel = from_to["from"];
				let target_channel = from_to["to"];
				document.getElementById("src_input").value = source_channel;
				document.getElementById("dst_input").value = target_channel;
				let filters = config["filters"];
				let filterTypes = ["rgx", "cs", "ci"];
				filterTypes.forEach((type) => {
					let itemFilters = filters[type];
					if (itemFilters.length > 0) {
						for (let i = 0; i < itemFilters.length; i++) {
							if (!(Object.keys(itemFilters[i]["value"])[0]="")) {
								if (type === "rgx") {
									document.getElementById("use_regex_check").checked = true;
								}
								if (type === "cs") {
									document.getElementById("use_cs_check").checked = true;
								}
								if (type === "ci") {
									document.getElementById("use_ci_check").checked = true;
								}
								generateFilterItems(type, true, document.getElementById(`${type}_rows`));
								createRefactorTab(type, i+1);
								document.getElementById(`${type}${i+1}_input`).value = Object.keys(itemFilters[i]["value"])[0];
								let itemFilterValues = itemFilters[i]["value"][Object.keys(itemFilters[i]["value"])[0]];
								if (itemFilterValues.length > 0) {
									let inputId = i+1;
									let filterCount = 0;
									itemFilterValues.forEach((itemFilterValue) => {
										filterCount++;
										let itemFilterValueKey = Object.keys(itemFilterValue)[0];
										let itemFilterValueValue = itemFilterValue[itemFilterValueKey];
										handleAddRule(type, inputId);
										document.getElementById(`${type}${inputId}_rule${filterCount}_select_rule`).value = itemFilterValueKey;
										document.getElementById(`${type}${inputId}_rule_row${filterCount}_input`).value = itemFilterValueValue;
									});
								}
							}
							document.getElementById(`${type}${i+1}_priority`).value = itemFilters[i]["priority"];
						}
					}
					// let itemFilterKeys = Object.keys(itemFilters);
					// if (itemFilterKeys.length > 0) {
					// 	itemFilterKeys.forEach((itemFilterKey) => {
					// 		generateFilterItems(type, true, document.getElementById(`${type}_rows`));
					// 		createRefactorTab(type, (document.getElementById(`${type}_rows`).childElementCount - 1) * 3 + 1);
					// 		document.getElementById(`${type}${(document.getElementById(`${type}_rows`).childElementCount - 1) * 3 + 1}_input`).value = itemFilterKey;
					// 		let itemFilterValues = itemFilters[itemFilterKey];
					// 		if (itemFilterValues.length > 0) {
					// 			let inputId = 1;
					// 			itemFilterValues.forEach((itemFilterValue) => {
					// 				let itemFilterValueKey = Object.keys(itemFilterValue)[0];
					// 				let itemFilterValueValue = itemFilterValue[itemFilterValueKey];
					// 				handleAddRule(type, inputId);
					// 				document.getElementById(`${type}${(document.getElementById(`${type}_rows`).childElementCount - 1) * 3 + 1}_rule1_select_rule`).value = itemFilterValueKey;
					// 				document.getElementById(`${type}${(document.getElementById(`${type}_rows`).childElementCount - 1) * 3 + 1}_rule_row1_input`).value = itemFilterValueValue;
					// 			});
					// 		}
					// 	});
					// }
				});
			} else {
				message = {
					message: {
						category: "danger",
						text: "No data found",
					},
				};
				showFlashedMessages(message);
			}
		})
		.catch(function (error) {
			// Handle errors here
			console.error("Fetch Error:", error);
		});
}
function saveWorkerConfig() {
	const path = window.location.pathname;
	let selectedConnId = undefined;
	if (path === "/rules") {
		// Add click event listeners to the dropdown items
		var dropdownItems = document.querySelectorAll('[name="workers_conn_item"]');
		dropdownItems.forEach(function (item) {
			item.addEventListener("click", function (event) {
				event.preventDefault(); // Prevent default link behavior
				selectedConnId = item.getAttribute("conn_id"); // Store the selected ID
				loadWorkerConfigForConn(selectedConnId);
				select_conn_drop_button = document.getElementById("select_conn_drop_button");
				select_conn_drop_button.textContent = `Connection: ${item.textContent}`;
			});
		});

		// Add a click event listener to the "Save changes" button
		var saveChangesButton = document.getElementById("save_worker_settings");
		saveChangesButton.addEventListener("click", function (event) {
			event.preventDefault(); // Prevent default button behavior

			// Check if a connection is selected
			if (selectedConnId) {
				var formData = new FormData(); // Create a new FormData object
				var formDataForConnConfig = collectFormDataForConnConfig(); // Use the form's ID to get the form data
				formData.append("conn_config", JSON.stringify(formDataForConnConfig)); // Add the form data to the FormData object
				// Send the data to "/updateConnection" with the selected ID as a parameter
				fetch(`/saveWorkerConfig?connection_id=${selectedConnId}`, {
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
						message = {
							message: { category: "success", text: "Data sent successfully!" },
						};
						showFlashedMessages(message);
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