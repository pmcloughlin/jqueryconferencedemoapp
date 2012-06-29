utils = {};

utils.showLoadingPanel = function () {
	$.mobile.showPageLoadingMsg("b", "Loading...  Please wait.", false);
};

utils.hideLoadingPanel = function () {
	$.mobile.hidePageLoadingMsg();
};

utils.showErrorMessage = function (errorMessage) {
	alert(errorMessage.join("\n"));
};

utils.isNullOrEmpty = function (testValue) {
	//Trim any white space before checking for null or empty
	testValue = $.trim(testValue);

	//the last entry is now checking for ascii nulls which come out of the hansen database
	return testValue == null || testValue == "null" || testValue == "" || testValue == "undefined" || testValue.match(/^\u0000+$/);
};

utils.getEntity = function (entityId) {
	var entities = state.entities.filter(function (entity) {
		return entity.entityId == entityId;
	});

	return entities[0];	
};

utils.getFormTemplate = function(entityTypeId) {
	var formTemplates = state.formTemplates.filter(function (template) {
		return template.entityTypeId == entityTypeId;
	});

	return formTemplates[0];
};
