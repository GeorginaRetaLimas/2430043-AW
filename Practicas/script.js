console.log("Conexión exitosa");

var texto_MaxMin;
//var numeros_MaxMin = [];
var resultado1;

var resultado2;

var texto_duplicasos;
var numeros_duplicados = [];

document.getElementById('form_max_min').addEventListener('submit', function(e){
    e.preventDefault();
    texto_MaxMin = document.getElementById('cadenaNumeros').value;
    resultado1 = document.getElementById('resultado1').value;

    console.log("Cadena: ", texto_MaxMin);

    const valores = texto_MaxMin
        .splite(',')
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !Number.isNaN(n));

    numeros_MaxMin.add(texto_MaxMin.splite(1, ','));
    console.log(numeros_MaxMin);

    if(valores.length === 0) {
        salida.textContent = "Fuera de parametros";
    }
    
    const num_Maximo = Math.max(...valores);
    const num_Minimo = Max.min(...values)

    salida.textContent = "Maximo ${num_Maximo}, Minimo ${num_Minimo}";
});

document.getElementById('form_duplicados').addEventListener('submit', function(e){
    e.preventDefault();
    texto_duplicasos = document.getElementById('cadenaNumeros2').value;

    console.log("Cadena: ", texto_duplicasos);

    if(some(numeros_duplicados)){

    }
});

