
App = (function(global, ui) {

	/*
	 * IMPLEMENTATION
	 */

	var App = function() {

		this.dialog  = null;
		this.sidebar = false;

		ui.Emitter.call(this);


		this.bind('refresh', function() {

			this.trigger('refresh-dialog');
			this.trigger('refresh-sidebar');

		}, this);


		this.bind('refresh-sidebar', function() {

			var sidebar = this.sidebar;
			var element = document.querySelector('#sidebar');
			if (element !== null) {

				if (sidebar === true) {
					if (element.className !== 'active') element.className = 'active';
				} else {
					if (element.className !== '')       element.className = '';
				}

			}

		}, this);

		this.bind('refresh-dialog', function() {

			var dialog   = this.dialog;
			var elements = [].slice.call(document.querySelectorAll('dialog'));
			if (elements.length > 0) {

				elements.forEach(function(element) {

					if (element.id === 'dialog-' + dialog) {
						element.className = 'active';
					} else {
						element.className = '';
					}

				});

			}

		}, this);

	};


	App.prototype = ui.extend({}, ui.Emitter.prototype, {

		setDialog: function(dialog) {

			dialog = typeof dialog === 'string' ? dialog : null;

			if (typeof dialog === 'string' || dialog === null) {

				this.dialog = dialog;
				this.trigger('refresh-dialog');

				return true;

			}


			return false;

		},

		setSidebar: function(sidebar) {

			if (sidebar === true || sidebar === false) {

				this.sidebar = sidebar;
				this.trigger('refresh-sidebar');

				return true;

			}


			return false;

		}

	});


	return App;

})(this, ui);

