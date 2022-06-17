function include(file) {
	let scriptTag = document.createElement('script');
	scriptTag.src = file;
	document.head.appendChild(scriptTag);
}

include('hal/platform/web.js')

window.onload = (event) => {
	include('starter.js')
};


