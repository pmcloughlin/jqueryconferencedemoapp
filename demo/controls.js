controls = {};

controls.controlArray = [];

controls.addControl = function (control) {
	controls.controlArray.push(control);
};

controls.getControl = function (controlId) {

	var controlSearch = controls.controlArray.filter(function (ctrl) {
		return (ctrl.id == controlId);
	});

	if (controlSearch.length == 0) {
		return null;
	}

	return controlSearch[0];
};

controls.loadControls = function () {

	//Loop through all of the controls and get the values
	for (var i = 0; i < controls.controlArray.length; i++) {

		if (controls.controlArray[i].controlType == "TextBox") {
			controls.controlArray[i].value = controls.getTextBoxValue(controls.controlArray[i].id);
		}

		if (controls.controlArray[i].controlType == "CheckBox") {
			controls.controlArray[i].value = controls.getCheckBoxValue(controls.controlArray[i].id);
		}

		if (controls.controlArray[i].controlType == "DropDownList") {
			controls.controlArray[i].value = controls.getSelectValue(controls.controlArray[i].id);
		}
	}
};

controls.setTextBoxValue = function (controlId, value) {
	$("#" + controlId).val(value);
};

controls.setCheckBoxValue = function (controlId, value) {
	$("#" + controlId).attr("checked", value);
};

controls.setSelectValue = function (controlId, value) {
	$("select#" + controlId + " option").each(function () { this.selected = (this.value == value); });
	//$('select#' + controlId).selectmenu('refresh');
};

controls.getTextBoxValue = function(controlId) {
	return $("#" + controlId).val();
};

controls.getSelectValue = function(controlId) {
	return $("#" + controlId + " option:selected").val();
};

controls.getSelectText = function (controlId) {
	return $("#" + controlId + " option:selected").text();
};

controls.getCheckBoxValue = function(controlId) {
	return $('#' + controlId).is(':checked');
};

controls.validate = function() {

	//Make sure controls are up to date
	controls.loadControls();

	var validationMessages = [];

	for (var i = 0; i < controls.controlArray.length; i++) {
		if (controls.controlArray[i].required && (controls.controlArray[i].value == null || controls.controlArray[i].value == '')) {
			validationMessages.push(controls.controlArray[i].controlName + " is required!");
		}
	}

	return validationMessages;
};

controls.clearControls = function() {
	controls.controlArray = [];
};