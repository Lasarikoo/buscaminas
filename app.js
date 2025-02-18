let cellCounter = 0;

function render10x10game() {
    if (cellCounter === 100) {
        console.log(cellCounter)
        return
    } else {
        for (let x = 0; x < 100; x++) { 
            document.getElementById("gametab").innerHTML += `<button class="shadow-sm casilla"></button>`;
            cellCounter++
        
            // Agregar un salto de línea después de cada 10 botones, excepto antes del primero
            if ((x + 1) % 10 === 0) {
                document.getElementById("gametab").innerHTML += `<br>`;
            }
        }
        console.log("10x10 Generated");
    }
}