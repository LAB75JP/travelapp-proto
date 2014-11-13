
document.addEventListener('DOMContentLoaded', function() {

	var menu = [].slice.call(document.querySelectorAll('menu li a'));
	if (menu.length > 0) {

		menu.forEach(function(item) {

			var path = document.location.pathname.split('/').pop();
			var file = item.href.split('/').pop();
			if (path === file) {
				item.className = 'focus';
			}

		});

	}

});

