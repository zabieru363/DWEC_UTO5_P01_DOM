(function (){
	let divExamples = document.getElementById('examples').children[12];
	let buttons = divExamples.getElementsByClassName('tab-pane')[7].getElementsByTagName('button');

	function project(){

		/**
		 * Clossure para contar los cubos que se van creando.
		 * @returns Un objeto literal con funciones para manejar
		 * el contador.
		 */
		function instancesCounter() {
			let cubes = 0;	// Variable para ir contando los cubos.
			let removedCubes = 0; 	// Contador para contar los cubos que se van eliminando.

			/**
			 * Método que suma 1 al contador de cubos.
			 */
			function newCube() {
				cubes++;
			};

			/**
			 * Método que resta 1 al contador de cubos.
			 */
			function destroyCube() {
				cubes--;
			}

			/**
			 * Método que suma 1 al contador de cubos eliminados.
			 */
			function addRemovedCube() {
				removedCubes++;
			}

			/**
			 * Método que muestra el total de cubos creados.
			 * @returns El total de cubos creados.
			 */
			function showTotalInstances() {
				return cubes;
			}

			/**
			 * Método que devuelve todos los cubos que se
			 * han eliminado.
			 * @returns Todos los cubos que se han eliminado.
			 */
			function showTotalRemovedCubes() {
				return removedCubes;
			}

			return {
				newCube,
				destroyCube,
				addRemovedCube,
				showTotalInstances,
				showTotalRemovedCubes
			}
		}

		/**
		 * Función que crea el primer cubo y devuelve el objeto HTML
		 * para poder trabajar con el y manipularlo.
		 * @param {*} instanceNumber El número de instancia del cubo.
		 * @returns Un cubo para poder trabajar con el y hacer lo
		 * que necesitemos.
		 */
		function createCube() {
			const cube = $("<div></div>");

			cube.css({
				background: "red",
				color: "white",
				width: "50px",
				height: "50px",
				position: "absolute",
				top: "100px",
				left: "150px"
			});

			counter.newCube();
			cube.text(counter.showTotalInstances());
			cube.appendTo(area);
			cubes.push(cube);

			return cube;
		}

		// Variables globales
		const coordinates = $("<span></span>");
		const showid = $("<span></span>");
		let counter = instancesCounter();
		const acctions = [];
		const cubes = [];	// Colección para guardar los cubos que se van creando.
		const customEvent = new CustomEvent("event", {bubbles: false});		// Evento personalizado.

		// Área para el proyecto
		const main = $("main");
		const area = $("<div></div>");
		area.addClass("container");

		area.css({
			border: "2px solid red",
			height: "400px",
			position: "relative"
		});

		main.before(area);
		area.append(coordinates);

		coordinates.css({
			position: "fixed",
			width: "200px",
			height: "50px",
			border: "1px solid #ddd",
			background: "#1d1d1d",
			color: "white",
			textAlign: "center",
			display: "none"
		});
		
		// Listeners del area del proyecto.
		area.on("mousemove", function(e) {
			let x = e.offsetX;
			let y = e.offsetY;

			coordinates.css({
				// Intento que la capa siga al cursor lo máximo posible.
				display: "block",
				top:  `${y + 150}px`,
				left: `${x + 150}px`
			});

			coordinates.text(`Eje X:${x} - Eje Y:${y}`);
		});

		area.on("mouseleave", function() {
			coordinates.css("display", "none");
		});

		// * CUBO INICIAL
		const cube = createCube();

		// Creo esta medida de seguridad ya que me daba problemas si eliminaba el primer cubo.
		cube.on("click", function(e) {
			e.stopPropagation();
			showid.text(`El cubo inicial no se puede eliminar.`);
			showid.css("display", "block");

			setTimeout(function() {
				showid.css("display", "none");
			}, 2000);
		});

		// Contenedor para mostrar los cubos eliminados.
		showid.css({
			textAlign: "center",
			width: "300px",
			height: "50px",
			border: "1px solid #ddd",
			background: "#1d1d1d",
			color: "white",
			display: "none"
		});

		area.append(showid);
		
		// Crear cubos en la posición que se quiera.
		area.on("click", function(e) {
			let x = e.offsetX;
			let y = e.offsetY;
			
			const newCube = cube.clone();

			newCube.css({
				top: `${y}px`,
				left: `${x}px`
			});

			counter.newCube();
			newCube.text(counter.showTotalInstances());
			$(this).append(newCube);
			cubes.push(newCube);
			
			// Si se hace clic en un cubo este se elimina.
			newCube.on("click", function(e) {
				e.stopPropagation();	// Hacemos que al destruir el cubo no se propague el evento.
				const pos = cubes.findIndex(c => c.text() == counter.showTotalInstances());
				cubes.splice(pos, 1);
				counter.destroyCube();
				counter.addRemovedCube();
				$(this).remove();

				// newCube.get(0).addEventListener("event", function() {
				// 	showid.text(`Cubo ${this.textContent} eliminado. Total cubos eliminados ${counter.showTotalRemovedCubes()}`);
				// 	showid.css("display", "block");
				// });

				// newCube.dispatchEvent(customEvent);
				// setTimeout(function() {
				// 	showid.css("display", "none");
				// }, 2000);
			});
		});

		// Evento de pulsado de tecla.
		$(document).on("keydown", function (event) {
			switch(event.code){ // Detección de tecla pulsada.
				case "ArrowUp":
					addAction("up");
					break;
				case "ArrowDown":
					addAction("down");
					break;
				case "ArrowLeft":
					addAction("left");
					break;
				case "ArrowRight":
					addAction("right");
					break;
				case "KeyC":
					addAction("color");
					break;
				case "NumpadAdd":
					addAction("sizeUp");
					break;
				case "NumpadSubtract":
					addAction("sizeDown");
					break;
				case "Enter":
					executeAcctions();
					break;
				default:
					break;
			}
			event.preventDefault();
		});

		// Funciones de implementación de acciones
		function moveUp(cube){
			let top = cube.offset().top;
			top -= 10;
			top = (top < 0)? 0 : top;
			cube.css("top", top + "px");
		}
		
		function moveDown(cube){
			let top = cube.offset().top;
			top += 10;
			top = (top > area.height() - cube.height()) ? area.height() - cube.height() : top;
			cube.css("top", top + "px");
		}
		
		function moveLeft(cube){
			let left = cube.offset().left;
			left -= 10;
			left = (left < 0)? 0 : left;
			cube.css("left", left + "px");
		}
		
		function moveRight(cube){
			let left = cube.offset().left;
			left += 10;
			left = (left > area.width() - cube.width()) ? area.width() - cube.width() : left;
			cube.css("left", left + "px");
		}

		function incrementSize(cube) {
			const w = cube.width();

			w += 5;

			cube.width(w);
			cube.height(w);
		}
		
		function decrementSize(cube) {
			const w = cube.width();
			
			// El tamaño cómo mínimo debe de ser de 10px.
			if(!(w <= 10)) {
				w -= 5;
				cube.width(w);
				cube.height(w);
			}
		}

		function randomColor(cube){
			let r = Math.floor((Math.random() * 256));
			let g = Math.floor((Math.random() * 256));
			let b = Math.floor((Math.random() * 256));
			cube.style.background = `rgb(${r}, ${g}, ${b})`;
		}

		// Registro de acción y generación de span
		function addAction(action){
			let span = document.createElement("span");

			acctions.push({
				action: action,
				span: span
			});

			span.textContent = action;
			span.style.padding = "10px";
			span.style.border = "1px solid #ddd";
			span.style.display = "block";
			span.style.float = "left";
			span.style.margin = "2px";
			span.style.cursor = "pointer";

			span.addEventListener("mouseenter", function () {
				this.style.backgroundColor = "red";
				this.style.color = "white";
			});

			span.addEventListener("mouseleave", function () {
				this.style.backgroundColor = "white";
				this.style.color = "black";
			});

			span.addEventListener("click", function () {
				let index = acctions.findIndex((action) => {
					return action.span === this;
				});

				acctions.splice(index,1);
				this.remove();
			});

			area.appendChild(span);
		}

		// Ejecución de acciones recursiva
		function executeAcctions(){
			if(acctions.length > 0){
				let action = acctions.shift();
				for(const cube of cubes) {
					switch(action.action){
						case "up":
							moveUp(cube);
							break;
						case "down":
							moveDown(cube);
							break;
						case "left":
							moveLeft(cube);
							break;
						case "right":
							moveRight(cube);
							break;
						case "sizeUp":
							incrementSize(cube);
							break;
						case "sizeDown":
							decrementSize(cube);
							break;
						case "color":
							randomColor(cube);
							break;
						default:
							break;
					}
	
					action.span.remove();
					setTimeout(executeAcctions, 50);
				}
			}
		}
	}

	buttons[0].addEventListener('click', function(){
		$$result.clear();
		$$result.logBold('Proyecto');
		$$result.log('Funciones');
		$$result.log('Mover izquierda');
		$$result.log('Mover derecha');
		$$result.log('Mover arriba');
		$$result.log('Mover abajo');
		$$result.log('Cambiar color C');
		$$result.log('Ejecutar acciones ENTER');
		$$result.log('Borrar acción cliqueando en SPAN');
		project();
	});
})();

