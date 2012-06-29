render = {};

render.pageTemplate = function () {
	return '<div id="dynamicDataPage" data-url="dynamicDataPage" class="dynamicDataPage" data-role="page">';
};

render.headerTemplate = '<div data-role="header">' +
							'<a href="#Assignments" data-icon="delete" class="cancelButton">Back</a>' +
							'<h1 class="applicationTitle"></h1>' +
							'<a class="saveInspection" data-icon="check">Save Inspection</a>' +
						'</div>';

render.contentTemplateStart = function () {
	return '<div data-role="content">' +
				'<h1 class="formTitle"></h1>' +
					'<p class="formDescription"></p>' +
				'<div id="dynamicControlContainer">';


};

render.contentTemplateEnd = function () {
	return '</div>' +
	'</div>';
};

render.pageEndTemplate = '</div>';

render.getPageTemplate = function () {

	var html = '';

	html = render.pageTemplate();
	html += render.headerTemplate;
	html += render.contentTemplateStart();
	html += render.renderControls(state.currentFormTemplate);
	html += render.contentTemplateEnd() + render.pageEndTemplate;

	return html;
};

render.renderForm = function () {

	$('.dynamicDataPage').remove();

	//create markup
	var newPage = $(render.getPageTemplate());

	//append it to the page container
	newPage.appendTo($.mobile.pageContainer);

	//Append the Address to the title
	$(".applicationTitle").text(state.currentEntity.address);
	$(".formTitle").text(state.currentFormTemplate.title);
	$(".formDescription").text(state.currentFormTemplate.description);
};

render.renderControls = function (formTemplate) {

	var body = '';

	for (var i = 0; i < formTemplate.controls.length; i++) {
		body = body + render.renderControl(formTemplate.controls[i]);
	}

	return body;
};

render.renderControl = function (renderControl) {

	if (renderControl.controlType == 'TEXTBOX') {
		return render.renderTextBox(renderControl);
	}

	if (renderControl.controlType == 'DROPDOWNLIST') {
		return render.renderDropDownList(renderControl);
	}

	if (renderControl.controlType == 'CHECKBOX') {
		return render.renderCheckBox(renderControl);
	}

	return '';

};

render.renderTextBox = function (textControl) {

	var html = '<div data-role="fieldcontain"><label for="%CONTROLID%">%LABEL%</label><input type="text" name="%CONTROLID%" id="%CONTROLID%" ';

	if (!textControl.enabled) {
		html += ' disabled="disabled" ';
	}

	html += ' />';

	html = html.replace( /%CONTROLID%/g , textControl.controlId);

	html = html.replace(/%LABEL%/, textControl.label);

	if (textControl.required) {
		html = html + "<span style='color:red'>*</span>";
	}

	html = html + "</div>";

	var control = new Control(textControl.controlId, textControl.property, textControl.required, 'TextBox',textControl.label);
	controls.addControl(control);

	return html;
};

render.renderCheckBox = function (checkControl) {

	var html = '<div data-role="fieldcontain"><fieldset data-role="controlgroup"><legend>%LABEL%</legend><label for="%CONTROLID%">&nbsp</label><input type="checkbox" name="%CONTROLID%" id="%CONTROLID%" %CHECKEDATTRIBUTE% ';

	if (!checkControl.enabled) {
		html += ' disabled="disabled" ';
	}

	html += ' /></fieldset></div>';

	if (checkControl.checked) {
		html = html.replace(/%CHECKEDATTRIBUTE%/, 'checked="checked"');
	} else {
		html = html.replace(/%CHECKEDATTRIBUTE%/, "");
	}
	html = html.replace(/%CONTROLID%/g, checkControl.controlId);
	html = html.replace(/%LABEL%/, checkControl.label);

	var control = new Control(checkControl.controlId, checkControl.property, checkControl.required, 'CheckBox',checkControl.label);
	controls.addControl(control);

	return html;
};

render.renderDropDownList = function (dropControl) {

	var html = '<div data-role="fieldcontain"><label for="%CONTROLID%" class="select">%LABEL%</label>';

	html += '<select name="%CONTROLID%" id="%CONTROLID%"';

	if (!dropControl.enabled) {
		html += ' disabled="disabled" ';
	}
	html += '>';

	//Add in a blank one
	html += '<option value=""></option>';

	for (var i = 0; i < dropControl.items.length; i++) {
		if (utils.isNullOrEmpty(dropControl.items[i].Value) ||
							utils.isNullOrEmpty(dropControl.items[i].Text)) {
			continue;
		}

		html += '<option value="' + dropControl.items[i].Value + '">' + dropControl.items[i].Text + '</option>';
	}

	html += '</select></div>';

	html = html.replace(/%CONTROLID%/g, dropControl.controlId);
	html = html.replace(/%LABEL%/, dropControl.label);

	var control = new Control(dropControl.controlId, dropControl.property, dropControl.required, 'DropDownList', dropControl.label);
	controls.addControl(control);

	return html;

};