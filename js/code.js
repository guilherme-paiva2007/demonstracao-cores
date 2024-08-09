let ColorsStyleSheet = 1;
let AuxiliarStyleSheet = 2;

String.prototype.removeText = function removeText(text = "") {
    return this.split(text).join('');
};

String.prototype.isIn = function isIn(list = []) {
    let isIn = false;
    list.forEach(element => {
        if (this == element) isIn = true;
    })
    return isIn;
}

Number.prototype.toHexadecimal = function toHexadecimal() {
    let number = Math.floor(this);
    return number.toString(16);
}

Array.prototype.fillUntil = function fillUntil(filler, lengthNeeded) {
    if (typeof lengthNeeded !== "number") lengthNeeded = 0;

    while (this.length < lengthNeeded) {
        this.push(filler)
    }
    return this
}

/**
 * Passa por todos os elementos que levem uma classe específica, aplicando uma função callback
 * @param {String} className Nome da classe a ser procurada
 * @param {function} func Função callback, sendo primeiro parâmetro a classe e segundo o array com argumentos
 * @param  {...any} args Array com os outros argumentos a serem utilizados pela função callback
 */
function forEach_Classes(className = "", func = (class_element) => {}, ...args) {
    let classElementsSize = document.getElementsByClassName(className).length;

    for (let i = 0; i < classElementsSize; i++) {
        func(document.getElementsByClassName(className)[i], args);
    }
};

/**
 * CUIDADO! Esta função reescreve todo o conteúdo do elemento para um bloco de parágrafo.
 * @param {HTMLElement} element Elemento a ser reescrito
 * @param {String} text Texto a ser inserido
 */
function writeInside(element, text) {
    if (element.innerHTML !== `<p>${text}</p>`) {
        element.innerHTML = `<p>${text}</p>`;
    }
};

/**
 * Transforma um código de cor em um array com os códigos de cor
 * @param {Color.codeText} text 
 * @returns {Color.codes}
 */
function getColorTextToNumbers(text) {
    let colorType = "";
    let numbers = [];

    if (text.startsWith('rgb')) colorType = "rgb"
    if (text.startsWith('hsl')) colorType = "hsl"
    if (text.startsWith('#')) colorType = "hex"
    
    text = text.removeText(colorType).removeText('(').removeText(')').removeText(' ').removeText('#');
    if (colorType == "rgb" || colorType == "hsl") {
        text = text.removeText('a')
        numbers = text.split(',');
        numbers.forEach((number, index) => {
            numbers[index] = new Number(number) + 0;
        });
    }
    if (colorType == "hex") {
        numbers[0] = parseInt(text.slice(0, 2), 16);
        numbers[1] = parseInt(text.slice(2, 4), 16);
        numbers[2] = parseInt(text.slice(4, 6), 16);
    }
    return numbers;
};

/**
 * Coleta as cores de fundo e index das classes de uma folha de estilo.
 * @param {number} styleSheet Número da folha de estilo
 * @returns {[HTMLClass.Name, Color.codes, HTMLClass.Index]}
 */
function getCSSBGColorRules(styleSheet) {
    let listLength = 0;
    let classRules = [];
    for (let i = 0; i < document.styleSheets[styleSheet].cssRules.length; i++) {
        if (document.styleSheets[styleSheet].cssRules[i].selectorText.startsWith('.')) {
            listLength++;
            classRules.push(i);
        };
    }

    let list = [];

    classRules.forEach((classRule, index) => {
        list.push([
            document.styleSheets[styleSheet].cssRules[classRule].selectorText.slice(1), 
            document.styleSheets[styleSheet].cssRules[classRule].style.backgroundColor,
            classRule
        ]);
        list[index][1] = getColorTextToNumbers(list[index][1]);
    })

    return list;
};

/**
 * Verifica se a cor é escura ou clara.
 * @param {Color.codes} colorArr 
 * @param {boolean} invert Determina se inverterá o retorno
 * @returns {boolean}
 */
function isDark(colorArr = [0, 0, 0], invert) { // FUNÇÃO RETIRADA E ADAPTADA DE: https://www.w3schools.com/lib/w3color.js (LINHA 82) | UTILIZADA NA PÁGINA: https://www.w3schools.com/css/css_colors_rgb.asp
    let value = (((colorArr[0] * 299 + colorArr[1] * 587 + colorArr[2] * 114) / 1000) < 150);
    if (invert) value = !value;
    return value;
}


// ESCREVER UMA FUNÇÃO PARA CONVERTER OS TIPOS DE CORES, OU CONJUNTO DE FUNÇÕES QUE CONVERTE OUTROS TIPOS NO DESEJADO


/**
 * 
 * @param {string} colorClass 
 * @param {Color.codes} colors Aceita apenas arrays de código (ou codeText de hexadecimal).
 * @param {number} styleSheet 
 * @param {"rgb" | "rgba" | "hsl" | "hsla" | "hex" | "hexa"} colorType 
 */
function changeColor(colorClass, colors = [0, 0, 0, 1], styleSheet, colorType) {
    let documentRules = document.styleSheets[styleSheet].cssRules;
    let colorRules = [];
    for (let i = 0; i < documentRules.length; i++) {
        if (documentRules[i].selectorText == '.' + colorClass) {
            colorRules.push(i);
        }
    }

    let colorText = "";
    switch (colorType) {
        case "rgba":
            colorText = `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[3]})`;
            break;
        case "hsl":
            colorText = `hsl(${colors[0]}, ${colors[1]}%, ${colors[2]}%)`;
            break;
        case "hsla":
            colorText = `hsla(${colors[0]}, ${colors[1]}%, ${colors[2]}%, ${colors[3]})`;
            break;
        case "hex":
            if (typeof colors == "string") { colorText = `#${colors.removeText('#')}` }
            if (typeof colors == "object") { colorText = `#${colors[0]}${colors[1]}${colors[2]}` }
            break;
        case "hexa":
            if (typeof colors == "string") { colorText = `#${colors.removeText('#')}` }
            if (typeof colors == "object") { colorText = `#${colors[0]}${colors[1]}${colors[2]}${colors[3]}` }
            break;
        default:
            colorText = `rgb(${colors[0]}, ${colors[1]}, ${colors[2]})`;
            break;
    }

    colorRules.forEach((colorRuleIndex) => {
        document.styleSheets[styleSheet].cssRules[colorRuleIndex].style.backgroundColor = colorText;
    })
}

/**
 * Junta códigos isolados de cores em um texto de `255, 255, 255`
 * @param {[ColorCode_1, ColorCode_2, ColorCode_3, ColorCode_Alpha]} colorCodes 
 */
function concatColor(colorCodes = [0, 0, 0], alphaBreak = true) {
    let text = "";
    if (colorCodes.length == 3) alphaBreak = false;
    if (alphaBreak) {
        text = colorCodes.slice(0, -1).join(', ').concat('<br>' + colorCodes[3])
    } else {
        text = colorCodes.join(', ')
    }
    return text;
}

class Color {
    /**
     * 
     * @param {"rgb" | "rgba" | "hsl" | "hsla" | "hex" | "hexa"} type 
     * @param {*} codes 
     */
    constructor(type = "rgb", codes) {
        this.type = type
        
        if (!type.isIn(['rgb', 'rgba', 'hsl', 'hsla', 'hex', 'hexa'])) this.type = "rgb";
        
        this.codes = codes

        this.codeText = ""
        switch (this.type) {
            case "rgb":
                this.codes = this.codes.map(number => { if(typeof number !== "number") { return 0 } else return number })
                this.codes.fillUntil(0, 3);
                this.codes = this.codes.slice(0, 3);
                this.codeText = `rgb(${this.codes[0]}, ${this.codes[1]}, ${this.codes[2]})`
                break;
            case "rgba":
                this.codes = this.codes.map(number => { if(typeof number !== "number") { return 0 } else return number })
                this.codes.fillUntil(0, 3);
                if (this.codes[3] == undefined || typeof this.codes[3] !== "number") this.codes[3] = 1.0;
                if (this.codes[3] > 1) this.codes[3] = 1.0;
                if (this.codes[3] < 0) this.codes[3] = 0;
                this.codes = this.codes.slice(0, 4);
                this.codeText = `rgba(${this.codes[0]}, ${this.codes[1]}, ${this.codes[2]}, ${this.codes[3]})`;
                break;
            case "hsl":
                this.codes.fillUntil(0, 1);
                if (this.codes[1] == undefined || typeof this.codes[1] !== "number") this.codes[1] = 100;
                if (this.codes[1] > 100) this.codes[1] = 100;
                if (this.codes[1] < 0) this.codes[1] = 0;
                if (this.codes[2] == undefined || typeof this.codes[2] !== "number") this.codes[2] = 50;
                if (this.codes[2] > 100) this.codes[2] = 100;
                if (this.codes[2] < 0) this.codes[2] = 0;
                this.codes = this.codes.map(number => { if(typeof number !== "number") { return 0 } else return number })
                this.codes = this.codes.slice(0, 3);
                this.codeText = `hsl(${this.codes[0]}, ${this.codes[1]}%, ${this.codes[2]}%)`;
                break;
            case "hsla":
                this.codes.fillUntil(0, 1);
                if (this.codes[1] == undefined || typeof this.codes[1] !== "number") this.codes[1] = 100;
                if (this.codes[1] > 100) this.codes[1] = 100;
                if (this.codes[1] < 0) this.codes[1] = 0;
                if (this.codes[2] == undefined || typeof this.codes[2] !== "number") this.codes[2] = 50;
                if (this.codes[2] > 100) this.codes[2] = 100;
                if (this.codes[2] < 0) this.codes[2] = 0;
                if (this.codes[3] == undefined || typeof this.codes[3] !== "number") this.codes[3] = 1.0;
                if (this.codes[3] > 1) this.codes[3] = 1.0;
                if (this.codes[3] < 0) this.codes[3] = 0;
                this.codes = this.codes.map(number => { if(typeof number !== "number") { return 0 } else return number })
                this.codes = this.codes.slice(0, 4);
                this.codeText = `hsla(${this.codes[0]}, ${this.codes[1]}%, ${this.codes[2]}%, ${this.codes[3]})`;
                break;
            case "hex":
                if (typeof this.codes == "string") {
                    this.codeText = this.codeText = `#${this.codes.removeText('#')}`
                    this.codes = this.codes.removeText('#');
                    this.codes = [this.codes.slice(0,2),this.codes.slice(2,4),this.codes.slice(4,6)]
                    break;
                }
                if (typeof this.codes == "object") {
                    this.codes.fillUntil(0, 3);
                    this.codes = this.codes.map(number => {
                        if (typeof number == "number") {
                            if (number > 255) { return 255 } else if (number < 0) { return 0 } else { return number }
                        } else { return number }
                    })
                    this.codes = this.codes.map(code => {
                        if (typeof code != "number") code = 0;
                        code = code.toHexadecimal();
                        return code;
                    })
                    this.codes = this.codes.map(code => {
                        if (code.length == 1) code = "0" + code;
                        return code;
                    })
                    this.codes = this.codes.slice(0, 3);
                    this.codeText = `#${this.codes[0]}${this.codes[1]}${this.codes[2]}`
                }
                break;
            case "hexa":
                if (typeof this.codes == "string") {
                    this.codeText = this.codeText = `#${this.codes.removeText('#')}`
                    this.codes = this.codes.removeText('#');
                    this.codes = [this.codes.slice(0,2),this.codes.slice(2,4),this.codes.slice(4,6),this.codes.slice(6,8)]
                    break;
                }
                if (typeof this.codes == "object") {
                    this.codes.fillUntil(0, 4);
                    this.codes = this.codes.map(number => {
                        if (typeof number == "number") {
                            if (number > 255) { return 255 } else if (number < 0) { return 0 } else { return number }
                        } else { return 0 }
                    })
                    this.codes = this.codes.map(code => {
                        if (typeof code !== "number") code = 0;
                        code = code.toHexadecimal();
                        return code;
                    })
                    this.codes = this.codes.map(code => {
                        if (code.length == 1) code = "0" + code;
                        return code;
                    })
                    this.codes = this.codes.slice(0, 4);
                    this.codeText = `#${this.codes[0]}${this.codes[1]}${this.codes[2]}${this.codes[3]}`
                }
                break;
        }
    }
}

function update(inputs, targetClass, type, descID) { // Posta as cores na classe-css
    // Também atualiza a legenda || CUIDADO COM HEXADECIMAL, UTILIZAR CONSTRUTOR DE COR (codeText)
    // Verificar os inputs, ativando as dinamicas que guardam.
    let colors = [];
    Object.values(inputs).forEach((input, index) => {
        if (document.getElementById(input.id) !== null) input.value = document.getElementById(input.id).value
        colors[index] = input.value
        if (input.dyname !== undefined) input.dyname()
    })
    if (colors[3] && type !== "hexa") {
        colors[3] = colors[3] / 100
    }

    colors = colors.map(color => {
        color = parseFloat(color)
        if (isNaN(color)) color = 0
        return color
    })

    let color = undefined
    if (type == "hex" || type == "hexa") {
        color = new Color(type, colors).codeText
    } else {
        color = colors
    }

    changeColor(targetClass, color, ColorsStyleSheet, type)
    
    document.getElementById(descID).innerHTML = new Color(type, colors).codeText;
    document.getElementById(descID).style.backgroundColor = new Color(type, colors).codeText;

    let newColors = getColorTextToNumbers(document.getElementById(descID).style.backgroundColor);
    let alphaOK = true;
    if (newColors[3] !== null) {
        if (newColors[3] < 0.5) alphaOK = false;
    }
    if (isDark(newColors) && alphaOK) {
        document.getElementById(descID).style.color = "white"
    } else {
        document.getElementById(descID).style.color = "#1f2d3d"
    }
}

class Slide {
    /**
     * Cria um objeto de slide com funcionalidades internas, podendo ser integrado à qualquer classe de cor com seus respectivos slides e legendas.
     * @reccom Ao definir Input[range], recomenda-se que insira os valores iniciais corretos para cada tipo, pois atualizarão automaticamente.
     * @RGB [0, 0, 0] @HSL [0, 100, 50] @HEX [0, 0, 0] (equivalente à #000000)
     * @Alpha Utiliza-se 1.0 como padrão (Em HEX, equivalente à FF no quarto parâmetro)
     * 
     * @param {"rgb" | "rgba" | "hsl" | "hsla" | "hex" | "hexa"} colorType Tipo de cor a ser interpretado pelos slides, determinando seu máximo e mínimo automaticamente.
     * @param {String.Class} targetClass Classe da folha de estilos interna da página HTML, tendo seu número determinado no início do documento.
     * @param {{input1: String.ID, input2: String.ID, input3: String.ID, alpha: String.ID}} colorSlidesIDs Objeto de configuração dos três slides utilizados e, se necessário, o uso de um quarto para Alpha.
     * @param {String.ID} descID Elemento que atualizará constantemente com o valor do texto. Não é obrigatório, deixe vazio ou indefinido para anulá-lo.
     */
    constructor(colorType, targetClass = "", colorInputsIDs = {input1: "", input2: "", input3: "", alpha: ""}, descID = "") {
        this.type = colorType;
        this.targetClass = targetClass;
        this.descID = descID;
        this.usesAlpha = false;
        if (this.type == "hexa" || this.type == "rgba" || this.type == "hsla") this.usesAlpha = true;
        if (!colorType.isIn(['rgb', 'rgba', 'hsl', 'hsla', 'hex', 'hexa'])) this.colorType = "rgb";
        Object.values(colorInputsIDs).forEach(id => {
            if (document.getElementById(id) == null || document.getElementById(id).type !== "range") return console.log("Só são permitidos inputs do tipo \"range\"");
        })

        this.currentColor = []
        switch (this.type) {
            case "rgb":
                this.currentColor = [0, 0, 0];
                break;
            case "hsl":
                this.currentColor = [0, 100, 50];
                break;
            case "hex":
                this.currentColor = [0, 0, 0];
        }

        class input {
            /**
             * 
             * @param {String.ID} id 
             * @param {"rgb/hex" | "hue" | "sat" | "lig" | "alpha"} type
             */
            constructor(id, type) {
                this.id = id;
                this.value = document.getElementById(id).value;
                this.dyname = undefined;
                this.type = type;

                if (this.type == "rgb/hex") { this.min = "0"; this.max = "255"; this.value = 128; }
                if (this.type == "hue") { this.min = "0"; this.max = "360"; this.value = 0; }
                if (this.type == "sat") { this.min = "0"; this.max = "100"; this.value = 100; }
                if (this.type == "lig") { this.min = "0"; this.max = "100"; this.value = 50; }
                if (this.type == "alpha") { this.min = "0"; this.max = "100"; this.value = 100; }
                if (this.type == "alpha-hex") { this.min = "0"; this.max = "255"; this.value = 255; }

                document.getElementById(this.id).min = this.min
                document.getElementById(this.id).max = this.max

                document.getElementById(id).value = this.value;
            }
        }

        let inputTypes = [];
        if (this.type == "rgb") inputTypes = ["rgb/hex", "rgb/hex", "rgb/hex"]
        if (this.type == "rgba") inputTypes = ["rgb/hex", "rgb/hex", "rgb/hex", "alpha"]
        if (this.type == "hsl") inputTypes = ["hue", "sat", "lig"]
        if (this.type == "hsla") inputTypes = ["hue", "sat", "lig", "alpha"]
        if (this.type == "hex") inputTypes = ["rgb/hex", "rgb/hex", "rgb/hex"]
        if (this.type == "hexa") inputTypes = ["rgb/hex", "rgb/hex", "rgb/hex", "alpha-hex"]

        this.inputs = {};
        this.inputs["1"] = new input(colorInputsIDs.input1, inputTypes[0])
        this.inputs["2"] = new input(colorInputsIDs.input2, inputTypes[1])
        this.inputs["3"] = new input(colorInputsIDs.input3, inputTypes[2])
        if (this.usesAlpha) this.inputs["alpha"] = new input(colorInputsIDs.alpha, inputTypes[3])

        this.update = function internUpdate() {
            update(this.inputs, this.targetClass, this.type, this.descID)
        }

        /**
         * Dar preferência para utilizar esta função ao reescrever os valores de algum input pelo terminal, evitando problemas pois atualizará automaticamente, sem a necessidade de mexer manualmente nos inputs.
         * @param {input} input 
         * @param {number} value 
         */
        this.change = function change(input, value) {
            if(input == undefined) return console.log('Utilize um input válido');
            if(input.max < value) value = input.max
            if(input.min > value) value = input.min
            document.getElementById(input.id).value = value;
            console.log(`Valor do Input \`${input.id}\` alterado com sucesso para ${value}`)
            this.update();
        }

        /**
         * Adiciona as funções do conjunto de dynamicInputs ao input
         * @param {Function} dynamic 
         * @param {input} input 
         * @param {string} color codeText da cor. Recomendado utilizar construtor de cor.
         */
        this.dyname = function dyname(dynamic, input, color, auxConfig) {
            if(input == undefined) return console.log('Utilize um input válido');
            if(dynamic == undefined) return console.log('Utilize uma dinâmica válida');

            let dynamicUpdate = function () {
                dynamic(input.id, color, input, auxConfig);
            }

            input.dyname = dynamicUpdate
            this.update()
        }

        this.update();
        
        document.getElementById(this.inputs[1].id).oninput = () => { update(this.inputs, this.targetClass, this.type, this.descID) }
        document.getElementById(this.inputs[2].id).oninput = () => { update(this.inputs, this.targetClass, this.type, this.descID) }
        document.getElementById(this.inputs[3].id).oninput = () => { update(this.inputs, this.targetClass, this.type, this.descID) }
        if (this.usesAlpha) document.getElementById(this.inputs["alpha"].id).oninput = () => { update(this.inputs, this.targetClass, this.type, this.descID) }
    }
}

let dynamicInputs = { // Funções que dinamizam os inputs através da funcionalidadea onfocus HTML
    hue: function hueAutoSlide(slideID, color, input, auxConfig) {
        let slideElement = document.getElementById(slideID)
        if (slideElement.min !== 0) slideElement.min = 0;
        if (slideElement.max !== 360) slideElement.max = 360;

        let auxValues = {}
        auxValues.lig = document.getElementById(auxConfig.ligID).value;
        auxValues.sat = document.getElementById(auxConfig.satID).value;
    
        let newColor = new Color('hsla', [parseInt(slideElement.value), parseInt(auxValues.sat), parseInt(auxValues.lig), 1.0]).codeText
        document.getElementById(slideID).style.backgroundColor = newColor;
        document.getElementById(slideID).style.transition = "0s";
    },
    /**
     * Transiciona entre duas cores de escolha.
     * @param {HTMLClass.ID} slideID 
     * @param {{color1: Color.codes, color2: Color.codes, colorsType: "rgb" | "hex" | "hsl" | "rgba" | "hexa" | "hsla"}} auxConfig Utilize cores de mesmo formato, sem alpha e em formato de códigos para não causar erros.
     */
    fading: function fadingSlide(slideID, color, input, auxConfig) { // ATUALIZAR FUTURAMENTE PARA COMPORTAR MAIS CORES E DE DIFERENTES TIPOS
        let avarageColor = [];
        let slide = {
            pos: document.getElementById(slideID).value - document.getElementById(slideID).min,
            end: document.getElementById(slideID).max - document.getElementById(slideID).min,
        }
        let gap_end = slide.end - slide.pos;
        let gap_start = slide.pos;

        if(auxConfig.colorsType == "hex" || auxConfig.colorsType == "hexa") {
            auxConfig.color1 = auxConfig.color1.map(code => parseInt(code, 16))
            auxConfig.color2 = auxConfig.color2.map(code => parseInt(code, 16))
        }

        avarageColor[0] = (auxConfig.color1[0] * gap_end + auxConfig.color2[0] * gap_start) / slide.end;
        avarageColor[1] = (auxConfig.color1[1] * gap_end + auxConfig.color2[1] * gap_start) / slide.end;
        avarageColor[2] = (auxConfig.color1[2] * gap_end + auxConfig.color2[2] * gap_start) / slide.end;
        avarageColor[3] = (auxConfig.color1[3] * gap_end + auxConfig.color2[3] * gap_start) / slide.end;

        if(auxConfig.colorsType == "hex" || auxConfig.colorsType == "hexa") { // HEXA NAO FUNCIONANDO
            avarageColor = avarageColor.map(code => code.toString(16))
        }

        let newColor = new Color(auxConfig.colorsType, avarageColor).codeText;
        document.getElementById(slideID).style.backgroundColor = newColor;
        document.getElementById(slideID).style.transition = "0s";
    },
    /**
     * Preenche o input range de acordo com seu valor.
     * @param {HTMLClass.ID} slideID 
     * @param {Color.codeText} color 
     */
    fill: function fillSlide(slideID, color) {
        let slideElement = document.getElementById(slideID);
        let min = slideElement.min;
        let max = slideElement.max - min;
        let value = slideElement.value - min;

        let range = Math.floor(value / max * 100);
        newBackground = `linear-gradient(90deg, ${color} ${range}%, rgba(127, 127, 127, 0.5) ${range+1}%)`; // Adicionar dinâmica com construtores de input para implementar hover adaptado em HTML (onmouseenter e onmouseleave)
        document.getElementById(slideID).style.background = newBackground
    },
    gradient: function gradientSlide() {
        
    }
}