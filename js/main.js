/**
 * Similar à Array.forEach, porém aplicado em HTMLCollection.
 * @param {Function} callback Passa pelos elementos dessa lista, executando tendo os parâmetros de: `element`, `index`, `collection`.
 */
HTMLCollection.prototype.forEach = function HTMLCollectionForEach(callback) {
    let collection = this;
    for (let index = 0; index < this.length; index++) {
        const element = collection[index];
        callback(element, index, collection)
    }
}

/**
 * Remove um trecho de texto e retorna o novo.
 * @param {string} text
 * @returns {string}
 */
String.prototype.removeText = function removeText(text = "") {
    return this.split(text).join('');
};

/**
 * Diz se esta string é elemento de uma lista.
 * @param {string[]} list 
 * @returns {boolean}
 */
String.prototype.isIn = function isIn(list = []) {
    let isIn = false;
    list.forEach(element => {
        if (this == element) isIn = true;
    })
    return isIn;
}

/**
 * Transforma um número em hexadecinal
 * @returns {string}
 */
Number.prototype.toHexadecimal = function toHexadecimal() {
    let number = Math.floor(this);
    return number.toString(16);
}

Number.prototype.isBetween = function isBetween(min, max, complexReturn) {
    if (min > max) [min, max] = [max, min];

    let isBetween = true;
    let rel = "between"
    if (this > max) { isBetween = false; rel = "bigger" };
    if (this < min) { isBetween = false; rel = "smaller" };

    if (complexReturn) {
        let newObject = {}
        newObject.is = isBetween;
        newObject.rel = rel;
        isBetween = newObject;
    }

    return isBetween;
}

/**
 * Preenche um array até que ele esteja completamente cheio e retorna o novo array.
 * @param {any} filler 
 * @param {number} lengthNeeded 
 * @returns {array}
 */
Array.prototype.fillUntil = function fillUntil(filler, lengthNeeded) {
    if (typeof lengthNeeded !== "number") lengthNeeded = 0;

    let array = [];
    for (let i = 0; i < this.length; i++) {
        array[i] = this[i];
        
    }

    while (array.length < lengthNeeded) {
        array.push(filler)
    }
    return array
}

/**
 * Retorna o valor invertido de uma string.
 */
String.prototype.reverse = function reverse() {
    return this.split('').reverse().join('')
}

const colorCorrect = {
    rgb: function correctRGB(codes, alpha) {
        codes = codes.map((code, index) => {
            if (typeof code !== "number") code = 0;
            if(index == 3 && alpha) {
                if (code > 1) code = 1;
                if (code < 0) code = 0;        
            }
            if (code > 255) code = 255;
            if (code < 0) code = 0;
            return code;
        })
        return codes
    },
    hsl: function correctHSL(codes, alpha) {
        codes = codes.map((code, index) => {
            if (typeof code !== "number") code = 0;
            if(index == 3 && alpha) {
                if (code > 1) code = 1;
                if (code < 0) code = 0;        
            }
            if (index == 0) {
                if (code > 360) code = 360;
                if (code < 0) code = 0;
            } else {
                if (code > 100) code = 100;
                if (code < 0) code = 0;
            }
            return code;
        })
        return codes
    },
    hex: function correctHEX(codes, alpha) {
        const hexaValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f']
        codes = codes.map(code => {
            if (typeof code !== "string") { code = "00" }
            code.split('').forEach(char => {
                if (!char.isIn(hexaValues)) code = "00"
            })
            return code;
        })
        codes = codes.map(code => parseInt(code, 16))
        codes = codes.map((code, index) => {
            if (code > 255) code = 255;
            if (code < 0) code = 0;
            return code;
        })
        codes = codes.map(code => code.toString(16))
        codes = codes.map(code => {
            if (code.length < 2) code = '0' + code;
            return code;
        })
        return codes
    },
    codesLength: function correctCodesLength(codes, alpha) {
        let amount = 3;
        if (alpha) amount = 4;

        if (codes.length > amount) codes = codes.slice(0, amount);
        if (codes.length < amount) {
            codes = codes.fillUntil(0, 3);
            if (alpha) codes[3] = 1;
        }
        return codes;
    }
}

class Color {
    /**
     * Cria um objeto de cor com seus códigos, fornecendo textos de função e opções para serem alteradas.
     * @param {"rgb" | "rgba" | "hsl" | "hsla" | "hex" | "hexa"} type 
     * @param {[string|number, string|number, string|number]} codes 
     */
    constructor(type, codes) {
        this.type = type;
        if (typeof this.type !== "string") this.type = "null";
        if (!this.type.isIn(["rgb", "rgba", "hsl", "hsla", "hex", "hexa"])) this.type = "null";

        this.alpha = false;
        if (this.type.isIn(["rgba", "hsla", "hexa"])) this.alpha = true;

        this.codes = codes;
        this.codes = colorCorrect.codesLength(this.codes, this.alpha);
        switch (this.type) {
            case "rgb":
            case "rgba":
                this.codes = colorCorrect.rgb(this.codes, this.alpha);
                break;
            case "hsl":
            case "hsla":
                this.codes = colorCorrect.hsl(this.codes, this.alpha);
                break;
            case "hex":
            case "hexa":
                this.codes = colorCorrect.hex(this.codes, this.alpha);
                break;
            case "null":
                this.codes = [0, 0, 0, 1];
                this.type = "rgb";
                break;
        }
        
        this.codeText = "";
        switch (this.type) {
            case "rgb":
            case "rgba":
            case "hsl":
            case "hsla":
                this.codeText = `${this.type}(${this.codes.join(', ')})`
                break;
            case "hex":
            case "hexa":
                this.codeText = `#${this.codes.join('')}`
                break;
        }
    }
}