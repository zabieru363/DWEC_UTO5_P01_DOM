'use strict';
(function (){
	let divExamples = document.getElementById('examples').children[2];
	let buttons = divExamples.getElementsByClassName('tab-pane')[1].getElementsByTagName('button');

	let computers = [
		{
			computerID: 134,
			brand: 'HP',
			model: 'EliteBook',
			memory: 16,
		},
		{
			computerID: 14,
			brand: 'HP',
			model: 'EliteBook',
			memory: 32,
		},
		{
			computerID: 456,
			brand: 'HP',
			model: 'Pavilion',
			memory: 16,
		},
	];

	// Using a for/in loop
	function forinSample() {
		$$result.clear();
		$$result.logBold('For-in');

		let computer = {
			brand: 'HP',
			model: 'EliteBook',
			memory: 16,
			showInfo: function(){
				return this.brand + " " + this.model;
			}
		}
		for (const key in computer) {
			$$result.logBold(key, computer[key]);
		}
	}
	buttons[0].addEventListener('click', forinSample);

	// Using a for/of loop
	function forofSample() {
		$$result.clear();
		$$result.logBold('For-of');

		for (const cp of computers) {
			$$result.log(JSON.stringify(cp));
		}
	}
	buttons[1].addEventListener('click', forofSample);

	// Looping over a string
	function loopStringSample() {
		$$result.clear();
		$$result.logBold('String como un array');

		let model = "EliteBook";
		let letters = "";

		for (const char of model) {
			letters += char;
		}
		$$result.log(letters); // EliteBook
	}
	buttons[2].addEventListener('click', loopStringSample);

	// Use the break statement
	function breakSample() {
		$$result.clear();
		$$result.logBold('Rompiendo un bucle');

		for (const cp of computers) {
			if (cp.memory > 16) {
				break;
			}
			$$result.log(JSON.stringify(cp));
		}
	}
	buttons[3].addEventListener('click', breakSample);

	// Use the continue statement
	function continueSample() {
		$$result.clear();
		$$result.logBold('Saltando iteración');

		for (const cp of computers) {
			if (cp.memory > 16) {
				continue;
			}
			$$result.log(JSON.stringify(cp));
		}
	}
	buttons[4].addEventListener('click', continueSample);

})();

