'use strict';
(function (){
	let divExamples = document.getElementById('examples').children[3];
	let buttons = divExamples.getElementsByClassName('tab-pane')[3].getElementsByTagName('button');

	function weakSetExample(){
		$$result.clear();
		$$result.logBold('Colección WeakSet');

		let visitedSet = new WeakSet();

		let john = { name: "John" };
		let pete = { name: "Pete" };

		visitedSet.add(john); // John nos visita
		visitedSet.add(pete); // luego Pete
		// visitedSet tiene 2 usuarios
		{
			let mary = { name: "Mary" };
			visitedSet.add(mary);
			$$result.log(visitedSet.has(mary)); // true
			// visitedSet tiene 3 usuarios
		}
		// Mary desaparece de la colección por acabar su bloque y perderse su referencia.
		$$result.log(visitedSet.has(john)); // true
		$$result.log(visitedSet.has(pete)); // true
	}
	buttons[0].addEventListener('click', weakSetExample);

	function weakMapExample(){
		// incrementar el recuento de visitas
		function countUser(user) {
			let count = visitsCountMap.get(user) || 0;
			visitsCountMap.set(user, count + 1);
		}

		$$result.clear();
		$$result.logBold('Colección WeakMap');

		let visitsCountMap = new WeakMap();
		{
			let john = { name: "John" };
			countUser(john); // cuenta sus visitas
			countUser(john); // cuenta sus visitas
			countUser(john); // cuenta sus visitas
			$$result.log(visitsCountMap.get(john)); // 3
		}
		// John deja de pertenecer automáticamente a la colección.
	}
	buttons[1].addEventListener('click', weakMapExample);

	function cache(){
		// calcular y recordad el resultado
		function process(obj) {
			if (!cache.has(obj)) {
				let result = 0;
				for (let i=1;i<64;i++) result = result + 2 ** i;
				cache.set(obj, result);
			}
			return cache.get(obj);
		}
		$$result.clear();
		$$result.logBold('Cache con WeakMap');
		let cache = new WeakMap();

		let obj = {/* Objeto cualquiera */};

		$$result.log(process(obj)); // 18446744073709552000
		$$result.log(process(obj)); // 18446744073709552000
	}
	buttons[2].addEventListener('click', cache);

})();

