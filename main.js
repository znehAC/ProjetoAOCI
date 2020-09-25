var pc = 0x00000000;
var ir = 0x00;
var mar = 0x00000000;
var mbr = 0x00000000;
var acc = 0x00000000;
var e = 0
var l = 0
var g = 0
var memoria = [];


let table = document.querySelector("table");
criarTabela(table);
lerMemoria()

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

function zerarProcessador(){
    pc = 0x00000000;
    ir = 0x00;
    mar = 0x00000000;
    mbr = 0x00000000;
    acc = 0x00000000;
    e = 0
    l = 0
    g = 0
}

function lerMemoria(){
    let temp = [];
    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
            let elemento = document.getElementById(`casa${j+(i*10)}`).value;
            temp[j+(i*10)] = parseInt(elemento, 16);
        }
    }
    memoria = temp;
    return temp;
}

function atualizarMemoria(){
    for(let i =0; i < 10; i++){
        for (let j = 0; j < 10; j++) {
            let temp = memoria[j+(i*10)];
            let palavra = formatarHexa(temp.toString(16), 8);
            document.getElementById(`casa${j+(i*10)}`).value = palavra;
        }
    }
}

function carregarMemoria(){
    lerMemoria()
    zerarProcessador()
    var codigo = document.getElementById("codigohexa").value;
    var linhas = codigo.split("\n");
    pc = parseInt(document.getElementById("ponteiro").value, 16);
    let contador = pc;
    linhas.forEach(linha => {
        if(linha != ""){
            memoria[contador] = parseInt(linha, 16)
            contador++;
        }
    });
    pc = parseInt(document.getElementById("ponteiro").value, 16);
    atualizarProcessador();
    atualizarMemoria();
}

function lerProcessador(){
    let temp = document.getElementById("pc").value;
    pc = parseInt(temp, 16);
    temp = document.getElementById("ir").value;
    ir = parseInt(temp, 16);
    temp = document.getElementById("acc").value;
    acc = parseInt(temp, 16);
    temp = document.getElementById("mar").value;
    mar = parseInt(temp, 16);
    temp = document.getElementById("mbr").value;
    mbr = parseInt(temp, 16);
    temp = document.getElementById("e").value;
    mbr = parseInt(temp, 16);
    temp = document.getElementById("l").value;
    mbr = parseInt(temp, 16);
    temp = document.getElementById("g").value;
    mbr = parseInt(temp, 16);

}

function atualizarProcessador(){
    let temp = formatarHexa(pc.toString(16), 8);
    document.getElementById("pc").value = temp;
    temp = formatarHexa(ir.toString(16), 2)
    document.getElementById("ir").value = temp;
    temp = formatarHexa(acc.toString(16), 8)
    document.getElementById("acc").value = temp;
    temp = formatarHexa(mar.toString(16), 8)
    document.getElementById("mar").value = temp;
    temp = formatarHexa(mbr.toString(16), 8)
    document.getElementById("mbr").value = temp;
    temp = formatarHexa(e.toString(16), 1)
    document.getElementById("e").value = temp;
    temp = formatarHexa(l.toString(16), 1)
    document.getElementById("l").value = temp;
    temp = formatarHexa(g.toString(16), 1)
    document.getElementById("g").value = temp;
}

function formatarHexa(palavra, tamanho){
    while(palavra.length < tamanho){
        palavra = "0" + palavra;
    }
    return palavra.toUpperCase();
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
            opcode = opCodeToHexa[opcode]
            let palavra = (opcode + immediate).toString(16);
            palavra = formatarHexa(palavra, 8);
            linhasHexa += palavra + "\n";
        }
    });
    document.getElementById("codigohexa").value = linhasHexa.toUpperCase();
}

function executarCiclo(){
    lerProcessador()
    lerMemoria()

    buscar(pc)
    pc++
    decodificar()
    executar()
    
    atualizarProcessador()
    atualizarMemoria()
}

function buscar(endereco){
    mbr = memoria[endereco]
}

function decodificar(){
    let palavra = mbr
    let mascara = 0x00FFFFFF

    ir = palavra>>24
    mar = palavra&mascara

}

function executar(){
    comando[ir]()
}



opCodeToHexa = {
    hlt: 0x00000000,
    ld: 0x01000000,
    st: 0x02000000,
    add: 0x03000000,
    sub: 0x04000000,
    mul: 0x05000000,
    div: 0x06000000,
    lsh: 0x07000000,
    rsh: 0x08000000,
    cmp: 0x09000000,
    je: 0x0A000000,
    jne: 0x0B000000,
    jl: 0x0C000000,
    jle: 0x0D000000,
    jg: 0x0E000000,
    jge: 0x0F000000,
    acch: 0x10000000,
    accl: 0x11000000,
    jmp: 0x12000000
}

comando = {
    0x00: function(){       //hlt
        return
    },  
    0x01: function(){       //ld
        buscar(mar) 
        acc = mbr
    },  
    0x02: function(){       //st
        mbr = acc   
        memoria[mar] = mbr    
    },  
    0x03: function(){       //add
        buscar(mar) 
        acc = acc + mbr     
    },  
    0x04: function(){       //sub
        buscar(mar) 
        acc = acc - mbr     
    },  
    0x05: function(){       //mul
        buscar(mar) 
        acc = acc * mbr
    },     
    0x06: function(){       //div
        buscar(mar) 
        acc = acc / mbr
    },     
    0x07: function(){       //lsh
        acc = acc<<1    
    },     
    0x08: function(){       //rsh
        acc = acc>>1
    },     
    0x09: function(){       //cmp
        buscar(mar)
        if(acc == mbr) e = 1
        else e = 0
        if(acc < mbr) l = 1
        else l = 0    
        if(acc > mbr) g = 1
        else g = 0

    },     
    0x0A: function(){       //je
        if(e == 1)
            pc = mar
    },     
    0x0B: function(){       //jne
        if( e == 0)
            pc = mar
    },     
    0x0C: function(){       //jl
        if(l == 1)
            pc = mar
    },
    0x0D: function(){       //jle
        if(e == 1 || l == 1)
            pc = mar
    },
    0x0E: function(){       //jg
        if(g == 1)
            pc = mar
    },
    0x0F: function(){       //jge
        if(e == 1 || g == 1)
            pc = mar
    },
    0x10: function(){},     //acch
    0x11: function(){},     //accl
    0x12: function(){       //jmp
        buscar(mar)
        pc = mbr
    }     
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

