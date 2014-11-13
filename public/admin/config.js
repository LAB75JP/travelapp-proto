
var _CONFIG = {

	DATABASE_FIELDS: {
		name:      String,
		longitude: /(.*)/g,
		latitude:  /(.*)/g,
		address:   /(.*)/g,
		city:      /^([A-Za-z]+)$/g,
		zip:       /^[0-9]{5}$/g,
		email:     /^([A-Za-z0-9_]+)@([A-Za-z0-9_]+)\.([A-Za-z]{2,4})$/g,
		domain:    /^www\.([A-Za-z0-9_]+)\.([A-Za-z]{2,4})$/g,
		phone:     /^([0-9\s]+)$/g
	}

};

