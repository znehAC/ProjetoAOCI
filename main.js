var pc;
var ir;
var mar;
var mbr;
var acc;
var e
var l
var g
var memoria = [];

//iniciar a GUI com valores iniciais
zerarProcessador()
let table = document.querySelector("table");
criarTabela(table);
lerMemoria()

//funcao para criar a tabela memoria
function criarTabela(table){
    var i = 3, j =4;
    for(i = 0; i <10; i++){
        //criando a linha
        let row = table.insertRow();
        let cb =  document.createElement("th"); 
        var textnode = document.createTextNode(`${(i*10).toString(16).toUpperCase()}`);
        cb.appendChild(textnode);
        cb.className = "celula";
        row.appendChild(cb);
        //criando as celulas 
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

//funcao que zera os valores no processador
function zerarProcessador(){
    pc = 0;
    ir = 0;
    mar = 0;
    mbr = 0;
    acc = 0;
    e = 0
    l = 0
    g = 0
}

//le a tabela memoria e armazena no vetor memoria
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

//le o vetor memoria e atualiza a tabela memoria
function atualizarMemoria(){
    for(let i =0; i < 10; i++){
        for (let j = 0; j < 10; j++) {
            let temp = memoria[j+(i*10)];
            let palavra = formatarHexa(temp.toString(16), 8);
            document.getElementById(`casa${j+(i*10)}`).value = palavra;
        }
    }
}

//envia o programa para a memoria
function carregarMemoria(){
    lerMemoria()
    zerarProcessador()
    var codigo = document.getElementById("codigohexa").value;
    var linhas = codigo.split("\n");
    pc = parseInt(document.getElementById("ponteiro").value, 16);
    let contador = pc;
    linhas.forEach(linha => {
        if(linha != ""){
            //converte as palavras que estao em string para int
            memoria[contador] = parseInt(linha, 16)
            contador++;
        }
    });
    //atualizar o PC caso o usuario queira editar
    pc = parseInt(document.getElementById("ponteiro").value, 16);
    atualizarProcessador();
    atualizarMemoria();
}

//le a GUI do processador e armazena dentro das varaiveis
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

//le as variaveis do processador e atualiza a GUI
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

//funcao para acrescentar bits a esquerda, para vizualicacao na GUI
function formatarHexa(palavra, tamanho){
    while(palavra.length < tamanho){
        palavra = "0" + palavra;
    }
    return palavra.toUpperCase();
}

//converte o as palavras para binario
function converter(){
    let codigo = document.getElementById("codigomaquina").value;
    var linhas = codigo.split("\n");
    var linhasHexa = "";
    linhas.forEach(linha => {
        if(linha != ""){
            let temp = linha.split(" ");
            let opcode = temp[0];
            if(temp.length == 2){
                //pega a string com os valores do immediate e converte para hexa
            immediate = parseInt(temp[1], 16);
            //caso o endereco passe de 6 bytes
            immediate = immediate&0x00FFFFFF;
            }else{
                immediate = 0x00;
            }
            opcode = opCodeToHexa[opcode]<<24;
            //monta a palavra de instrucao
            let palavra = (opcode | immediate).toString(16);
            palavra = formatarHexa(palavra, 8);
            //linhashexa eh uma string contendo todas as palavras, que serao
            //convertidas para int para armazenar na memoria
            linhasHexa += palavra + "\n";
        }
    });
    //atualiza a GUI do codigo traduzido
    document.getElementById("codigohexa").value = linhasHexa.toUpperCase();
}

//Ciclo do processador
function executarCiclo(){
    //Le os valores da GUI e guarda nas variaveis
    lerProcessador()
    lerMemoria()

    //busca na memoria a instrucao
    busca()
    pc++ //incrementa o PC
    decodifica() //decodifica a instrucao
    executa() //executa a instrucao
    
    //Atualiza a GUI
    atualizarProcessador()
    atualizarMemoria()
}

//realiza uma busca na memoria
function buscar(endereco){
    mbr = memoria[endereco]
}

function busca(){
    //busca na memoria a instrucao contida no endereco PC
    buscar(pc)
}

function decodifica(){
    //pega a palavra contida no mbr
    let palavra = mbr
    let mascara = 0x00FFFFFF
    //armazena o opcode no ir
    ir = palavra>>24
    //armazena o endereco no mar
    mar = palavra&mascara

}

function executa(){
    //executa o comando com o devido opcode
    comando[ir]()
}


//um objeto para relacionar o comando com o valor em hexadecimal
opCodeToHexa = {
    hlt: 0x00,
    ld: 0x01,
    st: 0x02,
    add: 0x03,
    sub: 0x04,
    mul: 0x05,
    div: 0x06,
    lsh: 0x07,
    rsh: 0x08,
    cmp: 0x09,
    je: 0x0A,
    jne: 0x0B,
    jl: 0x0C,
    jle: 0x0D,
    jg: 0x0E,
    jge: 0x0F,
    acch: 0x10,
    accl: 0x11,
    jmp: 0x12
}

//um objeto para relacionar o opcode com a instrucao
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
