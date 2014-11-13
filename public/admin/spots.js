
var app = (function(global, app) {

	var _FIELD_SELECTOR = (function(options) {

		var html = '<select>';

		html += '<option>-- Please select --</option>';

		options.forEach(function(value) {
			html += '<option value="' + value + '">' + value + '</option>';
		});

		html += '</select>';

		return html;

	})(Object.keys(_CONFIG.DATABASE_FIELDS));



	var _file     = null;
	var _dropzone = new ui.Dropzone('#dialog-import-dropzone');
	var _fields   = new ui.Handle('#dialog-import-fields');
	var _table    = new ui.Handle('#view-table');


	if (_dropzone.element !== null) {

		_dropzone.bind('create', function(id, buffer) {

			var ext = id.split('.').pop();
			if (ext === 'csv' || ext === 'CSV') {

				var fields = buffer.split('\n')[0].split(';');
				if (fields.length > 0) {

					var content = '<tr><th>CSV</th><th>Database</th></tr>';

					fields.forEach(function(option) {

						content += '<tr>';
						content += '<td>' + option + '</td>';
						content += '<td>' + _FIELD_SELECTOR + '</td>';
						content += '</tr>';

					});

					_fields.setContent(content);


					ui('#dialog-import div').setState('default');
					ui('#dialog-import div:nth-child(2)').setState('active');


					_file = {

						entries: buffer.split('\n').slice(1).map(function(line) {
							return line.split(';');
						}),

						fields:  fields.map(function(value) {

							return {
								csv:      value,
								database: null
							};

						})

					};

				}

			}

		}, this);

		_dropzone.bind('remove', function(id, buffer) {
			delete _files[id];
		}, this);

	}


	app.bind('search', function(search) {

		console.log('SEARCHING for ' + search + ' nao!');

	}, this);


	app.bind('open', function() {

		var file = _file;
		if (file !== null) {

			console.log(file);

			if (file.fields.length > 0 && file.entries.length > 0) {

				file.fields.forEach(function(field, index) {

					var element = _fields.element.querySelectorAll('select')[index] || null;
					if (element !== null) {

						var index = element.selectedIndex;
						if (index > 0) {
							field.database = element.options[index].text;
						}

					}

				});


				file.entries = file.entries.map(function(entry) {

					var clean = [];

					for (var e = 0; e < entry.length; e++) {

						if (file.fields[e].database !== null) {
							clean.push(entry[e]);
						}

					}

					return clean;

				});



				var content = '';

				content += '<tr>';
				content += '<th><input type="checkbox"></th>';
				file.fields.forEach(function(field) {

					if (field.database !== null) {
						content += '<th>' + field.database + '</th>';
					}

				});
				content += '</tr>';

				file.entries.forEach(function(entry) {

					content += '<tr>';
					content += '<td><input type="checkbox"></td>';
					entry.forEach(function(value) {
						content += '<td contenteditable="true">' + value + '</td>';
					});
					content += '</tr>';

				});


				_table.setContent(content);

			}

		}

	}, this);

	app.bind('export', function() {

		console.log('Exporting nao!');

	}, this);


	return app;

})(this, new App());

