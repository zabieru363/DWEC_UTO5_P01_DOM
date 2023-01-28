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
			 * Método que muestra el total de cubos creados.
			 * @returns El total de cubos creados.
			 */
			function showTotalInstances() {
				return cubes;
			}

			return {
				newCube,
				destroyCube,
				showTotalInstances
			}
		}

		
		// Variables globales
		const coordinates = document.createElement("span");
		const showid = document.createElement("span");
		let counter = instancesCounter();
		let removedCubes = 0;	// Contador para contar cuantos cubos se han eliminado.
		const acctions = [];
		const cubes = [];	// Colección para guardar los cubos que se van creando.
		const customEvent = new CustomEvent("event", {bubbles: false});		// Evento personalizado.

		// Área para el proyecto
		let main = document.getElementsByTagName("main")[0];
		const area = document.createElement("div");
		area.classList.add("container");
		area.style.border = "2px solid red";
		area.style.height = "400px";
		area.style.position = "relative";
		main.parentElement.insertBefore(area, main);

		area.appendChild(coordinates);
		coordinates.style.position = "fixed";
		coordinates.style.width = "200px";
		coordinates.style.height = "50px";
		coordinates.style.border = "1px solid #ddd";
		coordinates.style.background = "#1d1d1d";
		coordinates.style.color = "white";
		coordinates.style.textAlign = "center";
		coordinates.style.display = "none";
		
		// Listeners del area del proyecto.
		area.addEventListener("mousemove", function(e) {
			let x = e.offsetX;
			let y = e.offsetY;
			
			// Intento que la capa siga al cursor lo máximo posible.
			coordinates.style.display = "block";
			coordinates.style.top = y + 150 + "px";
			coordinates.style.left = x + 150 + "px";
			coordinates.textContent = `Eje X:${x} - Eje Y:${y}`;
		});

		area.addEventListener("mouseleave", function(e) {
			coordinates.style.display = "none";
		});

		// * CUBO INICIAL
		const cube = document.createElement("div");
		cube.style.background = "red";
		cube.style.color = "white";
		cube.style.width = "50px";
		cube.style.height = "50px";
		cube.style.position = "absolute";
		cube.style.top = "100px";
		cube.style.left = "150px";
		counter.newCube();
		const initialInstance = document.createTextNode(counter.showTotalInstances());
		cube.appendChild(initialInstance);
		area.appendChild(cube);
		cubes.push(cube);

		// El primer cubo inicial también se debe de poder eliminar.
		cube.addEventListener("event", function() {
			showid.textContent = `Cubo ${cube.textContent} eliminado. Total cubos eliminados ${removedCubes}`;
			showid.style.display = "block";
		});

		cube.addEventListener("click", function() {
			counter.destroyCube();
			this.remove();

			cube.dispatchEvent(customEvent);	// Ejecutamos el evento personalizado.
			setTimeout(function() {
				showid.style.display = "none";	// El mensaje desaparece despues de 2 segundos.
			}, 2000);
		});

		// Contenedor para mostrar los cubos eliminados.
		showid.style.textAlign = "center";
		showid.style.width = "300px";
		showid.style.height = "50px";
		showid.style.background = "#1d1d1d";
		showid.style.color = "white";
		showid.style.border = "1px solid #ddd";
		showid.style.display = "none";
		area.appendChild(showid);
		
		// Crear cubos en la posición que se quiera.
		area.addEventListener("click", function(e) {
			let x = e.offsetX;
			let y = e.offsetY;
			
			const newCube = cube.cloneNode();
			newCube.style.top = y + "px"
			newCube.style.left = x + "px";
			counter.newCube();
			const numberInstance = document.createTextNode(counter.showTotalInstances());
			newCube.append(numberInstance);
			this.append(newCube);
			cubes.push(newCube);
			
			// Si se hace clic en un cubo este se elimina.
			newCube.addEventListener("click", function(e) {
				e.stopPropagation();	// Hacemos que al destruir el cubo no se propague el evento.
				counter.destroyCube();
				removedCubes++;
				this.remove();

				newCube.addEventListener("event", function() {
					showid.textContent = `Cubo ${cube.textContent} eliminado. Total cubos eliminados ${removedCubes}`;
					showid.style.display = "block";
				});

				newCube.dispatchEvent(customEvent);
				setTimeout(function() {
					showid.style.display = "none";
				}, 2000);
			});
		});

		// Evento de pulsado de tecla.
		document.addEventListener("keydown", function (event) {
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
			let top = cube.offsetTop;
			top -= 10;
			top = (top < 0)? 0 : top;
			cube.style.top = top + "px";
		}

		function moveDown(cube){
			let top = cube.offsetTop;
			top += 10;
			top = (top > area.offsetHeight - cube.offsetHeight)? area.offsetHeight - cube.offsetHeight : top;
			cube.style.top = top + "px";
		}

		function moveLeft(cube){
			let left = cube.offsetLeft;
			left -= 10;
			left = (left < 0)? 0 : left;
			cube.style.left = left + "px";
		}

		function moveRight(cube){
			let left = cube.offsetLeft;
			left += 10;
			left = (left > area.offsetWidth - cube.offsetWidth)? area.offsetWidth - cube.offsetWidth : left;
			cube.style.left = left + "px";
		}

		function incrementSize(cube) {
			const w = cube.style.width;
			let size = +w.slice(0, 2);

			size += 5;
			cube.style.width = `${size}px`;
			cube.style.height = `${size}px`;
		}
		
		function decrementSize(cube) {
			const w = cube.style.width;
			let size = +w.slice(0, 2);
			
			// El tamaño cómo mínimo debe de ser de 10px.
			if(!(size <= 10)) {
				size -= 5;
				cube.style.width = `${size}px`;
				cube.style.height = `${size}px`;
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

