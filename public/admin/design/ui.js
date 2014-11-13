
document.addEventListener('DOMContentLoaded', function() {

	var dialogs = [].slice.call(document.querySelectorAll('dialog'));
	if (dialogs.length > 0) {

		dialogs.forEach(function(dialog) {

			dialog.addEventListener('click', function(event) {

				if (event.target === this) {
					this.className = '';
				}

			});

		});

	}

});


ui = (function(global) {

	/*
	 * HELPERS
	 */

	var _extend = function(target) {

		for (var a = 1, al = arguments.length; a < al; a++) {

			var object = arguments[a];
			if (object) {

				for (var prop in object) {
					target[prop] = object[prop];
				}

			}

		}


		return target;

	};

	var _unbind = function(type, callback, scope) {

		if (this.___events[type] !== undefined) {

			var found = false;

			for (var e = 0, el = this.___events[type].length; e < el; e++) {

				var entry = this.___events[type][e];

				if ((callback === null || entry.callback === callback) && (scope === null || entry.scope === scope)) {

					found = true;

					this.___events[type].splice(e, 1);
					el--;

				}

			}


			return found;

		}


		return false;

	};



	var Emitter = function() {
		this.___events = {};
	};


	Emitter.prototype = {

		bind: function(type, callback, scope, once) {

			type     = typeof type === 'string'     ? type     : null;
			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : this;
			once     = once === true;


			if (type === null || callback === null) {
				return false;
			}


			var passAction = false;
			var passSelf   = false;

			if (type.charAt(0) === '@') {
				type = type.substr(1, type.length - 1);
				passAction = true;
			} else if (type.charAt(0) === '#') {
				type = type.substr(1, type.length - 1);
				passSelf = true;
			}


			if (this.___events[type] === undefined) {
				this.___events[type] = [];
			}


			this.___events[type].push({
				passAction: passAction,
				passSelf:   passSelf,
				callback:   callback,
				scope:      scope,
				once:       once
			});


			return true;

		},

		trigger: function(type, data) {

			type = typeof type === 'string' ? type : null;
			data = data instanceof Array    ? data : null;


			if (this.___events[type] !== undefined) {

				var value = undefined;

				for (var e = 0; e < this.___events[type].length; e++) {

					var args  = [];
					var entry = this.___events[type][e];

					if (entry.passAction === true) {

						args.push(type);
						args.push(this);

					} else if (entry.passSelf === true) {

						args.push(this);

					}


					if (data !== null) {
						args.push.apply(args, data);
					}


					var result = entry.callback.apply(entry.scope, args);
					if (result !== undefined) {
						value = result;
					}


					if (entry.once === true) {

						if (this.unbind(type, entry.callback, entry.scope) === true) {
							e--;
						}

					}

				}


				if (value !== undefined) {
					return value;
				} else {
					return true;
				}

			}


			return false;

		},

		unbind: function(type, callback, scope) {

			type     = typeof type === 'string'     ? type     : null;
			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : null;


			var found = false;

			if (type !== null) {

				found = _unbind.call(this, type, callback, scope);

			} else {

				for (type in this.___events) {

					var result = _unbind.call(this, type, callback, scope);
					if (result === true) {
						found = true;
					}

				}

			}


			return found;

		}

	};



	var Dropzone = function(query) {

		this.element = document.querySelector(query);


		var element = this.element;
		if (element !== null) {

			var that = this;


			element.addEventListener('dragenter', function(event) {

				event.stopPropagation();
				event.preventDefault();

				ui(this).setState('active');

			}, false);

			element.addEventListener('dragleave', function(event) {

				event.stopPropagation();
				event.preventDefault();

				ui(this).setState('default');

			}, false);

			element.addEventListener('dragover',  function(event) {

				event.stopPropagation();
				event.preventDefault();

			}, false);

			element.addEventListener('drop',      function(event) {

				event.stopPropagation();
				event.preventDefault();

				ui(this).setState('default');


				var files = [].slice.call(event.dataTransfer.files);
				if (files.length === 1) {

					files.forEach(function(file) {

						var reader = new FileReader();

						reader.onload = function(event) {
							that.trigger('create', [ file.name, event.target.result ]);
						};

						reader.readAsText(file);

					});

				}

			}, false);

		}


		Emitter.call(this);

	};

	Dropzone.prototype = _extend({}, Emitter.prototype, {

	});



	var Handle = function(query) {

		this.element = document.querySelector(query);

	};

	Handle.prototype = _extend({}, Emitter.prototype, {

		setContent: function(content) {

			content = typeof content === 'string' ? content : null;


			var element = this.element;
			if (element !== null && content !== null) {

				this.element.innerHTML = content;

				return true;

			}


			return false;

		},

		setState: function(state) {

			var element = this.element;
			if (element !== null) {

				if (state === 'default') {

					var classes = element.className.split(' ');
					var index   = classes.indexOf('active');
					if (index !== -1) {
						classes.splice(index, 1);
						element.className = classes.join(' ');
					}

					return true;

				} else if (state === 'active') {

					var classes = element.className.split(' ');
					var index   = classes.indexOf('active');
					if (index === -1) {
						classes.push('active');
						element.className = classes.join(' ');
					}

					return true;

				}

			}


			return false;

		}

	});


	var ui = function(element) {

		if (typeof element === 'string') {

			return new Handle(element);

		} else if (element instanceof HTMLElement) {

			var handle = new Handle();
			if (handle.element === null) {
				handle.element = element;
			}

			return handle;

		}

	};


	ui.extend   = _extend;
	ui.Dropzone = Dropzone;
	ui.Emitter  = Emitter;
	ui.Handle   = Handle;


	return ui;

})(this);

