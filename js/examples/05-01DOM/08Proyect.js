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
		const main = $("main");

		// Área para el proyecto
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
		area.on({
			mousemove(e) {
				let x = e.offsetX;
				let y = e.offsetY;

				coordinates.css({
					// Intento que la capa siga al cursor lo máximo posible.
					display: "block",
					top:  `${y + 150}px`,
					left: `${x + 150}px`
				});

				coordinates.text(`Eje X:${x} - Eje Y:${y}`);
			},
			mouseleave() {
				coordinates.css("display", "none");
			}
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

				newCube.on("showCubes", function() {
					showid.text(`Cubo ${$(this).text()} eliminado. Total cubos eliminados ${counter.showTotalRemovedCubes()}`);
					showid.css("display", "block");
				});

				newCube.trigger("showCubes");	// Permite ejecutar un evento personalizado.
				setTimeout(function() {
					showid.css("display", "none");
				}, 2000);
			});
		});

		// Evento de pulsado de tecla.
		$(document).on("keydown", function (event) {
			switch(event.code){ 	// Detección de tecla pulsada.
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

		/**
		 * Mueve el cubo 10 pixeles hacia arriba.
		 * @param {*} cube El cubo que se quiere mover.
		 */
		function moveUp(cube){
			let top = cube.position().top;
			top -= 10;
			top = (top < 0)? 0 : top;
			cube.css("top", top + "px");
		}
		
		/**
		 * Mueve el cubo 10 pixeles hacia abajo.
		 * @param {*} cube El cubo que se quiere mover.
		 */
		function moveDown(cube){
			let top = cube.position().top;
			top += 10;
			top = (top > area.height() - cube.height()) ? area.height() - cube.height() : top;
			cube.css("top", top + "px");
		}
		
		/**
		 * Mueve el cubo 10 píxeles hacia la izquierda.
		 * @param {*} cube El cubo que se quiere mover.
		 */
		function moveLeft(cube){
			let left = cube.position().left;
			left -= 10;
			left = (left < 0)? 0 : left;
			cube.css("left", left + "px");
		}
		
		/**
		 * Mueve el cubo 10 píxeles hacia la derecha.
		 * @param {*} cube El cubo que se quiere mover.
		 */
		function moveRight(cube){
			let left = cube.position().left;
			left += 10;
			left = (left > area.width() - cube.width()) ? area.width() - cube.width() : left;
			cube.css("left", left + "px");
		}

		/**
		 * Aumenta el tamaño del cubo 5 pixeles.
		 * @param {*} cube El cubo del cúal se quiere aumentar el tamaño.
		 */
		function incrementSize(cube) {
			let w = cube.width();

			if(!(w >= 100)) {
				w += 5;
				cube.width(w);
				cube.height(w);
			} else {
				alert("Los cubos no se pueden ampliar más! El limite es 100px");
			}
		}
		
		/**
		 * Disminuye el tamaño del cubo 5 píxeles.
		 * @param {*} cube El cubo del cuál se quiere disminuir el tamaño.
		 */
		function decrementSize(cube) {
			let w = cube.width();
			
			// El tamaño cómo mínimo debe de ser de 10px.
			if(!(w <= 10)) {
				w -= 5;
				cube.width(w);
				cube.height(w);
			} else {
				alert("Los cubos no se pueden reducir más! El limite es 10px");
			}
		}

		/**
		 * Permite cambiar el color del cubo.
		 * @param {*} cube El cubo del cuál se quiere cambiar el color.
		 */
		function randomColor(cube){
			let r = Math.floor((Math.random() * 256));
			let g = Math.floor((Math.random() * 256));
			let b = Math.floor((Math.random() * 256));
			cube.css("background", `rgb(${r}, ${g}, ${b})`);
		}

		/**
		 * Función que añade una acción al área de trabajo y a la
		 * colección de acciones que se van mandando al cubo.
		 * @param {*} action La acción que se quiere registrar.
		 */
		function addAction(action) {
			const span = $("<span></span>");

			acctions.push({action, span});

			span.text(action);
			span.css({
				padding: "10px",
				border: "1px solid #ddd",
				display: "block",
				float: "left",
				margin: "2px",
				cursor: "pointer"
			});

			span.on({
				mouseenter() {
					$(this).css({
						background: "red",
						color: "white"
					});
				},
				mouseleave() {
					$(this).css({
						background: "white",
						color: "black"
					});
				},
				click(e) {
					e.stopPropagation();	// Impedimos que al hacer clic en un span se creen cubos nuevos.
					const index = acctions.findIndex(action => action.span === $(this));
	
					acctions.splice(index, 1);
					$(this).remove();
				}
			});

			area.append(span);
		}

		/**
		 * Función que ejecuta todas las acciones para todos los cubos.
		 */
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

