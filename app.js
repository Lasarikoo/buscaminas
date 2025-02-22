let cellCounter = 0;
let mineBoxes = new Set();
let html = "";
let listCheck = [-1, +1, -11, -10, -9, +9, +10, +11];

function renderGame(boxes, mines) {
    // Vacía el tablero
    html = ``;
    mineBoxes.clear();
    // Asignación de minas
    while (mineBoxes.size < mines) {
        mineBoxes.add(Math.floor(Math.random() * boxes));
    }
    // Revisa si ya existe ese tablero
    if (cellCounter === boxes) {
        console.log(cellCounter)
        return
    // Generación de tablero
    } else {
        // Bucle de creación de celdas
        for (let x = 0; x < boxes; x++) { 
            // Crea celda con mina
            if (mineBoxes.has(x)) {
                html += `<button type="button" class="rounded bg-light casilla" id="${x}" onclick="checkBox(${x})"></button>`;
                console.log("MINA");
            // Crea celda sin mina    
            } else {
                html += `<button type="button" class="rounded bg-light casilla" id="${x}" onclick="checkBox(${x})"></button>`;
            }
            cellCounter++
        
            // Agregar un salto de línea después de cada 10 botones, excepto antes del primero
            if ((x + 1) % Math.sqrt(boxes) === 0) {
                html += `<br>`;
            }
        }
        console.log(`${boxes} Generated`);
        console.log(mineBoxes);
        document.getElementById("gametab").innerHTML = html;
    }
}

// Revisa que es la celda
function checkBox (id) {
    // Obtiene la casilla
    let boxChecked = document.getElementById(id);
    // Revisa si la casilla es una mina
    if (mineBoxes.has(id)) {
        boxChecked.classList.remove("casilla"); // Elimina la clase "casilla"
        boxChecked.classList.add("m"); // Agrega la clase "m"
        boxChecked.innerHTML = `<i class="fa-solid fa-bomb"></i>`; // Agrega el icono de bomba
        console.log("BOOM");
    } else { // PENDIENTE DE FINALIZAR
        for (f = 0; f < listCheck.length; f++) {
            let secondaryBoxCheck = document.getElementById(id + listCheck[f]);
            secondaryBoxCheck.classList.remove("casilla"); // Elimina la clase "casilla"
            secondaryBoxCheck.classList.add("g"); // Agrega la clase "g"
            console.log(`${secondaryBoxCheck} checked`);
        }
    }
}