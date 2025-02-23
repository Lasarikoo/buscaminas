let cellCounter = 0;
let mineBoxes = new Set();
let html = "";
let boardSize = 0;
let checkedCells = new Set();
let gameOver = false;

// Función de renderizado de tablero
function renderGame(boxes, mines) {

    // Vacía el tablero
    html = ``;
    mineBoxes.clear();
    checkedCells.clear();
    gameOver = false;

    // Asignación de minas
    while (mineBoxes.size < mines) {
        mineBoxes.add(Math.floor(Math.random() * boxes));
    }

    // Generación de tablero
    for (let x = 0; x < boxes; x++) { 
        html += `<button type="button" class="rounded bg-white casilla" id="${x}" onclick="checkBox(${x})" oncontextmenu="flagMine(event, ${x})"></button>`;
        cellCounter++;
        
        // Agregar un salto de línea después de cada fila
        if ((x + 1) % Math.sqrt(boxes) === 0) {
            html += `<br>`;
        }
    }

    // Modifica la variable de tamaño del tablero
    boardSize = Math.sqrt(boxes);

    // Devuelve debugs
    console.log(`${boxes} Generated`);
    console.log(mineBoxes);

    // Inserta el nuevo tablero
    document.getElementById("gametab").innerHTML = html;
}

// Función que detiene el juego
function endGame(result) {
    gameOver = true;
    let allButtons = document.querySelectorAll(".casilla"); // Obtiene todas las casillas
    allButtons.forEach(btn => btn.disabled = true); // Deshabilita todos los botones

    if (result === "Lose") {
        // Abre el modal de derrota
        let loserModal = new bootstrap.Modal(document.getElementById("loserModal"));
        loserModal.show();
    } else if (result === "Win") {
        // Abre el modal de derrota
        let winnerModal = new bootstrap.Modal(document.getElementById("winnerModal"));
        winnerModal.show();
    }
    
}


// Función para revisar las casillas
function checkBox(id) {

    // Evita revisar casillas ya revisadas o si el juego ha terminado
    if (gameOver || checkedCells.has(id)) return;

    // Obtiene a casilla clicada
    let boxChecked = document.getElementById(id);

    // Revisa si ya ha sido revisada
    if (!boxChecked) return;

    // Añade la casilla a la lista de revisadas
    checkedCells.add(id);

    // Cuando la casilla es una mina
    if (mineBoxes.has(id)) {
        boxChecked.classList.remove("casilla");
        boxChecked.classList.add("m");
        boxChecked.innerHTML = `<i class="fa-solid fa-bomb"></i>`;
        console.log("BOOM");
        // Termina el juego
        endGame("Lose");
        return;
    } 

    // Lista de posiciones adyacentes
    let listCheck = [
        -1, +1,                      // Izquierda y Derecha
        -boardSize, +boardSize,       // Arriba y Abajo
        -boardSize - 1, -boardSize + 1, // Arriba Izquierda y Arriba Derecha
        +boardSize - 1, +boardSize + 1  // Abajo Izquierda y Abajo Derecha
    ];

    // Cuantas minas hay cerca
    let closeMines = 0;

    // Que celdas adyacentes se pueden revisar
    let validAdjacentCells = [];

    // Bucle de revisión de celdas adyacentes
    for (let f = 0; f < listCheck.length; f++) {

        // Coge el array de posiciones adyacentes
        let checkId = Number(id) + listCheck[f];

        // Revisa si la casilla seleccionada esta en alguna esquina o borde
        let isLeftEdge = (id % boardSize === 0) && (listCheck[f] === -1 || listCheck[f] === -boardSize - 1 || listCheck[f] === +boardSize - 1);
        let isRightEdge = ((id + 1) % boardSize === 0) && (listCheck[f] === +1 || listCheck[f] === -boardSize + 1 || listCheck[f] === +boardSize + 1);
        let isTopEdge = (id < boardSize) && (listCheck[f] === -boardSize || listCheck[f] === -boardSize - 1 || listCheck[f] === -boardSize + 1);
        let isBottomEdge = (id >= (boardSize * (boardSize - 1))) && (listCheck[f] === +boardSize || listCheck[f] === +boardSize - 1 || listCheck[f] === +boardSize + 1);

        // Evita revisar casillas inexistentes
        if (isLeftEdge || isRightEdge || isTopEdge || isBottomEdge) {
            continue;
        }

        // Obtiene el id de la casilla adyacente
        let secondaryBoxCheck = document.getElementById(checkId);

        // Si la casilla adyacente existe y no ha sido revisada, la revisa
        if (secondaryBoxCheck && !checkedCells.has(checkId)) {

            // Revisa si el id de la casilla adyacente esta dentro de mines
            if (mineBoxes.has(checkId)) {
                closeMines++;

                // Guarda la casilla adyacente que no es mine, para revisar si esta tiene mines cerca
            } else {
                validAdjacentCells.push(checkId);
            }
        }
    }
    
    if (closeMines === 0) {
        // Si no tiene minas adyacentes se queda en blanco
        boxChecked.classList.remove("casilla");
        boxChecked.classList.add("g");
        boxChecked.innerHTML = ``;

        // Revisa todas las casillas adyacentes
        validAdjacentCells.forEach(adjacentId => checkBox(adjacentId));

        // Si hay minas adyacentes, mostrar el número
    } else {
        if (closeMines === 1) {
            boxChecked.innerHTML = `${closeMines}`;
            boxChecked.classList.remove("casilla");
            boxChecked.classList.add("g2");
            boxChecked.classList.add("text-primary"); 
        } else if (closeMines === 2) {
            boxChecked.innerHTML = `${closeMines}`;
            boxChecked.classList.remove("casilla");
            boxChecked.classList.add("g2");
            boxChecked.classList.add("text-success"); 
        } else if (closeMines === 3) {
            boxChecked.innerHTML = `${closeMines}`;
            boxChecked.classList.remove("casilla");
            boxChecked.classList.add("g2");
            boxChecked.classList.add("text-warning"); 
        } else {
            boxChecked.innerHTML = `${closeMines}`;
            boxChecked.classList.remove("casilla");
            boxChecked.classList.add("g2");
            boxChecked.classList.add("text-danger");
        }
    }

    // Verifica si todas las casillas sin minas han sido descubiertas
    if (checkedCells.size === (boardSize * boardSize) - mineBoxes.size) {
        endGame("Win");
        console.log("🏆 WINNER! Has ganado el juego.");
    }
}

// Poner banderita al hacer click derecho
function flagMine(event, id) {
    // Evita que aparezca el menú contextual
    event.preventDefault(); 

    let button = document.getElementById(id);
    if (!button || button.classList.contains("g") || button.classList.contains("g2")) return; // No colocar bandera en casillas reveladas

    // Alternar la bandera
    if (button.classList.contains("flag")) {
        button.classList.remove("flag");
        button.innerHTML = ""; // Quitar icono de bandera
    } else {
        button.classList.add("flag");
        button.innerHTML = `<i class="fa-solid fa-flag text-danger"></i>`; // Agregar icono de bandera
    }
}