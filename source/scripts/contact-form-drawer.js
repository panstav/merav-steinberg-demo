ready(function() {

	document.querySelector('[data-on-click="contact-form-drawer-toggle"]').addEventListener('click', function() {
		document.getElementById('contact-form-drawer').classList.toggle('open');
		document.body.classList.toggle('scroll-disabled');
	});

	document.querySelector('[data-on-click="close-contact-form-drawer"').addEventListener('click', function() {
		document.getElementById('contact-form-drawer').classList.remove('open');
		document.body.classList.remove('scroll-disabled');
	});

});

function ready(fn) {
	if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}