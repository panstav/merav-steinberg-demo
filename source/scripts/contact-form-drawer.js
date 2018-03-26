ready(function() {

	select('[data-on-click="contact-form-drawer-toggle"]').forEach((elem) => {
		elem.addEventListener('click', function() {
			document.getElementById('contact-form-drawer').classList.toggle('open');
			document.body.classList.toggle('scroll-disabled');
		});
	});

	select('[data-on-click="close-contact-form-drawer"').forEach((elem) => {
		elem.addEventListener('click', function() {
			document.getElementById('contact-form-drawer').classList.remove('open');
			document.body.classList.remove('scroll-disabled');
		});
	});

});

function ready(fn) {
	if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

function select(selector) {
	return Array.prototype.slice.call(document.querySelectorAll(selector));
}