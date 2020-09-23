var pc = 0;
var memoria = [];


let table = document.querySelector("table");
criarTabela(table);

function criarTabela(table){
    var i = 3, j =4;
    for(i = 0; i <10; i++){
        let row = table.insertRow();
        let cb =  document.createElement("th"); 
        var textnode = document.createTextNode(`${(i*10).toString(16).toUpperCase()}`);  
        cb.appendChild(textnode);
        cb.className = "celula";
        row.appendChild(cb);
        for(j = 0; j<10; j++){
            let cell = row.insertCell();
            var input = document.createElement("input");
            input.type = "text";
            input.className  = "casa";
            input.id = `casa${j+(i*10)}`
            input.value = `00000000`;
            input.size = 2;
            cell.className = "celula";
            cell.appendChild(input);
        }
    }
}

function lerMemoria(){
    var vetor = [];
    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
            let elemento = document.getElementById(`casa${j+(i*10)}`).value;
            vetor[j+(i*10)] = parseInt(elemento, 16);
        }
    }
    memoria = vetor;
    return vetor;
}

function escreverMemoria(){
    var codigo = document.getElementById("codigohexa").value;
    var linhas = codigo.split("\n");
    pc = parseInt(document.getElementById("ponteiro").value, 16);
    let contador = pc;
    linhas.forEach(linha => {
        if(linha != ""){
            let input = document.getElementById(`casa${contador}`);
            input.value = linha;
            contador++;
        }
    });
    lerMemoria();
}



function teste() {
    let texto = document.getElementById("maquina").value;
    document.getElementById("hexa").value = "codigo\nmuito\nfoda";
}

function subircodigo() {
    return null;
}

function converter(){
    let codigo = document.getElementById("codigomaquina").value;
    var linhas = codigo.split("\n");
    var linhasHexa = "";
    linhas.forEach(linha => {
        if(linha != ""){
            let temp = linha.split(" ");
            let opcode = temp[0];
             if(temp.length == 2){
                immediate = parseInt(temp[1], 16);
             }else{
                immediate = 0x00;
             }
            opcode = opCodeToHexa(opcode);
            let palavra = (opcode + immediate).toString(16);
            while(palavra.length < 8){
                palavra = "0" + palavra;
            }
            linhasHexa += palavra + "\n";
        }
    });
    document.getElementById("codigohexa").value = linhasHexa.toUpperCase();
}


function opCodeToHexa(opcode) {
    let retorno = 0x00000000;
    if (opcode == "hlt")
        retorno = 0x00000000;
    else if (opcode == "ld")
        retorno = 0x01000000;
    else if (opcode == "st")
        retorno = 0x02000000;
    else if (opcode == "add")
        retorno = 0x03000000;
    else if (opcode == "sub")
        retorno = 0x04000000;
    else if (opcode == "mul")
        retorno = 0x05000000;
    else if (opcode == "div")
        retorno = 0x06000000;
    else if (opcode == "lsh")
        retorno = 0x07000000;
    else if (opcode == "rsh")
        retorno = 0x08000000;
    else if (opcode == "cmp")
        retorno = 0x09000000;
    else if (opcode == "je")
        retorno = 0x0A000000;
    else if (opcode == "jne")
        retorno = 0x0B000000;
    else if (opcode == "jl")
        retorno = 0x0C000000;
    else if (opcode == "jle")
        retorno = 0x0D000000;
    else if (opcode == "jg")
        retorno = 0x0E000000;
    else if (opcode == "jge")
        retorno = 0x0F000000;
    else if (opcode == "acch")
        retorno = 0x10000000;
    else if (opcode == "accl")
        retorno = 0x11000000;
    else if (opcode == "jmp")
        retorno = 0x12000000;

    return retorno;

}