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

/**
 * Transforma um número em hexadecinal
 * @returns {string}
 */
Number.prototype.toHexadecimal = function toHexadecimal() {
    let number = Math.floor(this);
    return number.toString(16);
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

let lista = document.getElementsByTagName('p')