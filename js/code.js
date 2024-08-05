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
        numbers = text.split(',');
        numbers.forEach((number, index) => {
            numbers[index] = new Number(number) + 0;
        });
    }
    if (colorType == "hex") {
        numbers[0] = text.slice(0, 1);
        numbers[1] = text.slice(2, 3);
        numbers[2] = text.slice(4, 5);
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
     * @param {String} type 
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
                this.codeText = `hsla(${this.codes[0]}%, ${this.codes[1]}%, ${this.codes[2]}, ${this.codes[3]})`;
                break;
            case "hex":
                if (typeof this.codes == "string") {
                    this.codeText = `#${this.codes.removeText('#')}`
                    this.codes.removeText('#');
                    this.codes = [this.codes.slice(0,1),this.codes.slice(2,3),this.codes.slice(4,5)]
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
                    this.codeText = `#${this.codes.removeText('#')}`
                    this.codes.removeText('#');
                    this.codes = [this.codes.slice(0,1),this.codes.slice(2,3),this.codes.slice(4,5),this.codes.slice(6,7)]
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
     * 
     * @param {Object = {b: Number, c: Number}} a 
     */
    constructor(colorType = "rgb", targetID = "", colorSlidesIDs = {}, descID = "") {
        this.type = colorType;
        if (!colorType.isIn(['rgb', 'rgba', 'hsl', 'hsla', 'hex', 'hexa'])) this.colorType = "rgb";
    }
}