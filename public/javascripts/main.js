function show(elementId) {
	for(let element of document.getElementsByTagName('article')) {
		if (element.id == elementId) {
			element.style.display = 'block';
		} else {
			element.style.display = 'none';
		}
	}
}

function filter(className) {
	let sections = document.getElementsByTagName('section');
	let tags = document.getElementsByClassName('filter');
	for(let tag of tags) {
		if (tag.classList.contains('filter-'+className)) {
			tag.classList.add('active');
		} else {
			tag.classList.remove('active');
		}
	}
	for(let section of sections) {
		if (section.classList.contains('hidden')) {
			section.style.display = 'none';
		} else if (section.classList.contains(className) || section.classList.contains('about') || className == 'semua') {
			section.style.display = 'inline-table';
		} else {
			section.style.display = 'none';
		}
	}
}

show('download');
filter('semua');
