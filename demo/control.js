function Control(id, property, required, type, controlName) {
	this.id = id;
	this.property = property;
	this.required = required;
	this.controlType = type;
	this.controlName = controlName;
	this.value = '';
};

Control.prototype.setValue = function (value) {
	this.value = value;
};
