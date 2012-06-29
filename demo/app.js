$(document).bind("mobileinit", function () {
	//Set the defaults
	$.extend(  $.mobile , {
		loadingMessage: 'Please wait.  Loading.',
		loadingMessageTextVisible: true,
		allowCrossDomainPages: true
	});
	
	app.initialize();
});

app = {};

app.initialize = function () {

	//bind the login button
	$('#btnLogin').live('tap', function (e) {
		app.loginUser();
	});

	//Bind the listview buttons
	$("#entityAddresses a").live("tap", function () {
		utils.showLoadingPanel();

		//Pull out the current entity id and save it
		state.currentEntityId = $(this).data("identity");

		app.loadForm(state.currentEntityId);
	});

	$(".saveInspection").live("tap", function () {
		app.saveEntity();
	});
};

app.loginUser = function () {

	//Show the spinner
	utils.showLoadingPanel();

	var userName = $('#username').val();
	var password = $('#password').val();

	if (utils.isNullOrEmpty(userName) || utils.isNullOrEmpty(password)) {
		utils.showErrorMessage(['Username and Password are required to login.']);
		utils.hideLoadingPanel();
		return;
	}

	var url = config.servicesUrl + "Form/";

	var loginInformation = "{\"username\":\"" + username + "\",\"password\":\"" + password + "\"}";

	$.ajax({ type: "PUT",
		url: url,
		data: loginInformation,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		cache: false,
		success: function (data) {

			app.loadAddresses(data);
		},
		error: function (xhr, textStatus, errorThrown) {
			alert(errorThrown);
			utils.hideLoadingPanel();
			return;
		}
	});
};

app.loadAddresses = function (data) {

	//Keep the entities and templates in the DOM for later use
	state.entities = data.LoginUserResult.entities;
	state.formTemplates = data.LoginUserResult.formTemplates;
	
	//Clear the list
	$('#entityAddresses li').remove();

	$("#entityAddresses").append('<li data-role="list-divider" role="heading">Addresses</li>');

	//loop through and load in the addresses of the applications
	for (var i = 0; i < data.LoginUserResult.entities.length; i++) {

		$("#entityAddresses").append('<li><a href="#" data-identity="' + data.LoginUserResult.entities[i].entityId + '">' + data.LoginUserResult.entities[i].address + '</a></li>');
	}

	$("#Assignments").page();
	$('#entityAddresses').listview('refresh');

	$.mobile.hidePageLoadingMsg();

	$.mobile.changePage($("#Assignments"));
};

app.loadForm = function (entityId) {

	//Load in the entity and the form
	state.currentEntity = utils.getEntity(entityId);
	state.currentFormTemplate = utils.getFormTemplate(state.currentEntity.entityTypeId);

	//Clear out the control list before the form is rendered
	controls.clearControls();
	
	render.renderForm();

	app.loadEntityValues();

	$.mobile.hidePageLoadingMsg();

	$.mobile.changePage($("#dynamicDataPage"));

};

app.loadEntityValues = function () {

	//Loop through each control and set the value
	for (var i = 0; i < controls.controlArray.length; i++) {

		var propertyValue = state.currentEntity[controls.controlArray[i].property];

		//Now assign the value to the control
		if (controls.controlArray[i].controlType == 'TextBox') {
			controls.setTextBoxValue(controls.controlArray[i].id, propertyValue);
		}

		if (controls.controlArray[i].controlType == 'DropDownList') {
			controls.setSelectValue(controls.controlArray[i].id, propertyValue);
		}

		if (controls.controlArray[i].controlType == 'CheckBox') {
			if (propertyValue == 'Y' || propertyValue == true || propertyValue == 'true' || propertyValue == 'True') {
				controls.setCheckBoxValue(controls.controlArray[i].id, true);
			}
		}
	}
};

app.saveEntity = function () {

	//Validate the controls
	var validationMessages = controls.validate();

	if (!utils.isNullOrEmpty(validationMessages)) {
		utils.showErrorMessage(validationMessages);
		return;
	}

	//Loop through and set the values on the entity
	for (var i = 0; i < controls.controlArray.length; i++) {
		state.currentEntity[controls.controlArray[i].property] = controls.controlArray[i].value;
	}

	//Clear out the control list and the state.current settings so there is no overlap
	controls.clearControls();
	state.currentEntity = {};
	state.currentFormTemplate = {};
	state.currentEntityId = 0;

	$.mobile.changePage($("#Assignments"));
};



