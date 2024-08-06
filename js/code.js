let ColorsStyleSheet = 1;

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
        numbers[0] = text.slice(0, 2);
        numbers[1] = text.slice(2, 4);
        numbers[2] = text.slice(4, 6);
    }
    return numbers;
};

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

function isDark(colorArr = [0, 0, 0]) { // FUNÇÃO RETIRADA E ADAPTADA DE: https://www.w3schools.com/lib/w3color.js (LINHA 82) | UTILIZADA NA PÁGINA: https://www.w3schools.com/css/css_colors_rgb.asp
    return (((colorArr[0] * 299 + colorArr[1] * 587 + colorArr[2] * 114) / 1000) < 150);
}

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
            colorText = `hsla(${colors[0]}%, ${colors[1]}%, ${colors[2]}, ${colors[3]})`;
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
    constructor(colorType = "rgb", targetClass = "", colorInputsIDs = {input1: "", input2: "", input3: "", alpha: ""}, descID = "") {
        this.type = colorType;
        this.targetClass = targetClass;
        this.descID = descID;
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
             * @param {"rgb/hex" | "hue" | "sat/lig" | "alpha"} type
             */
            constructor(id, type) {
                this.id = id;
                this.value = document.getElementById(id).value;
                this.dyname = undefined;
                this.type = type;

                if (this.type == "rgb/hex") { this.min = "0"; this.max = "255" }
                if (this.type == "hue") { this.min = "0"; this.max = "360" }
                if (this.type == "sat/lig") { this.min = "0"; this.max = "100" }
                if (this.type == "alpha") { this.min = "0"; this.max = "255" }

                document.getElementById(this.id).min = this.min
                document.getElementById(this.id).max = this.max
            }
        }

        let inputTypes = [];
        if (this.type == "rgb") inputTypes = ["rgb/hex", "rgb/hex", "rgb/hex"]
        if (this.type == "rgba") inputTypes = ["rgb/hex", "rgb/hex", "rgb/hex", "alpha"]
        if (this.type == "hsl") inputTypes = ["hue", "sat/lig", "sat/lig"]
        if (this.type == "hsla") inputTypes = ["hue", "sat/lig", "sat/lig", "alpha"]
        if (this.type == "hex") inputTypes = ["rgb/hex", "rgb/hex", "rgb/hex"]
        if (this.type == "hexa") inputTypes = ["rgb/hex", "rgb/hex", "rgb/hex", "alpha"]

        this.inputs = {};
        this.inputs["1"] = new input(colorInputsIDs.input1, inputTypes[0])
        this.inputs["2"] = new input(colorInputsIDs.input2, inputTypes[1])
        this.inputs["3"] = new input(colorInputsIDs.input3, inputTypes[2])
        if (this.type == "hexa" || this.type == "rgba" || this.type == "hsla") this.inputs.alpha = new input(colorInputsIDs.alpha, inputTypes[3])

        this.update = function update(inputs = this.inputs, targetClass = this.targetClass, type = this.type) { // Posta as cores na classe-css
            // Também atualiza a legenda || CUIDADO COM HEXADECIMAL, UTILIZAR CONSTRUTOR DE COR (codeText)
            // Verificar os inputs, ativando as dinamicas que guardam.
            let colors = [];
            Object.values(inputs).forEach((input, index) => {
                if (document.getElementById(input.id) !== null) input.value = document.getElementById(input.id).value
                colors[index] = input.value
                if (input.dyname !== undefined) input.dyname()
                console.log(colors, input)
            })

            changeColor(targetClass, colors, ColorsStyleSheet, type)
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
        this.dyname = function dyname(dynamic, input, color) {
            if(input == undefined) return console.log('Utilize um input válido');
            if(dynamic == undefined) return console.log('Utilize uma dinâmica válida');

            let dynamicUpdate = function () {
                dynamic(input.id, color);
            }

            input.dyname = dynamicUpdate
        }

        this.update();
        update = this.update
        Object.values(this.inputs).forEach((input) => {
            document.getElementById(input.id).oninput = update;
        })
    }
}

let dynamicInputs = { // Funções que dinamizam os inputs através da funcionalidadea onfocus HTML
    hue: function hueAutoSlide(slideID) {
        let slideElement = document.getElementById(slideID)
        if (slideElement.min !== 0) slideElement.min = 0;
        if (slideElement.max !== 360) slideElement.max = 360;
    
        let newColor = new Color('hsla', [parseInt(slideElement.value), 100, 50, 0.7]).codeText
        document.getElementById(slideID).style.backgroundColor = newColor;
    },
    fading: function fadingSlide(slideID) {
        // Aumenta a intensidade conforme aumenta o valor do input
    },
    fill: function fillSlide(slideID, color) { // Atualizar todos para inputOBJ (objetos de input[range] do construtor de Slide)
        let slideElement = document.getElementById(slideID);
        let min = slideElement.min;
        let max = slideElement.max - min;
        let value = slideElement.value - min;

        let range = Math.floor(value / max * 100);
        newBackground = `linear-gradient(90deg, ${color} ${range}%, rgba(127, 127, 127, 0.5) ${range+1}%)`; // Adicionar dinâmica com construtores de input para implementar hover adaptado em HTML (onmouseenter e onmouseleave)
        document.getElementById(slideID).style.background = newBackground
    }
}


const colorSelect2 = new Slide("rgb", "colorSelect2", {input1: "colorSelect2HUE", input2: "colorSelect2SATUR", input3: "colorSelect2LIGHT", alpha: "colorSelect2ALPHA"})
