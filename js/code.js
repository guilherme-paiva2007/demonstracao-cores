let ColorsStyleSheet = 1;

String.prototype.removeText = function removeText(text = "") {
    return this.split(text).join('');
};

function forEach_Classes(className = "", func = function func(class_element) {}, ...args) {
    let classElementsSize = document.getElementsByClassName(className).length;

    for (let i = 0; i < classElementsSize; i++) {
        func(document.getElementsByClassName(className)[i], args);
    }
};

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

// function getCSSBGColorRules(styleSheet) { // REMOVIDO POIS CONTABILIZA OUTRAS REGRAS QUE NÃO SÃO CLASSES
//     let listLength = document.styleSheets[styleSheet].cssRules.length;
//     let list = [];

//     for (let i = 0; i < listLength; i++) {
//         list[i] = [
//             document.styleSheets[styleSheet].cssRules[i].selectorText.slice(1), 
//             document.styleSheets[styleSheet].cssRules[i].style.backgroundColor,
//             i
//         ];
//         let colorText = getColorTextToNumbers(list[i][1]);
//         list[i][1] = colorText;
//     };

//     return list;
// };

function isDark(colorArr = [0, 0, 0]) { // FUNÇÃO RETIRADA E ADAPTADA DE: https://www.w3schools.com/lib/w3color.js (LINHA 82) | UTILIZADA NA PÁGINA: https://www.w3schools.com/css/css_colors_rgb.asp
    return (((colorArr[0] * 299 + colorArr[1] * 587 + colorArr[2] * 114) / 1000) < 150);
}

function changeColor(colorClass, colors = [0, 0, 0], styleSheet) {
    let documentRules = document.styleSheets[styleSheet].cssRules;
    let colorRules = [];
    for (let i = 0; i < documentRules.length; i++) {
        if (documentRules[i].selectorText == '.' + colorClass) {
            colorRules.push(i);
        }
    }

    colorRules.forEach((colorRuleIndex) => {
        document.styleSheets[styleSheet].cssRules[colorRuleIndex].style.backgroundColor = `rgb(${colors[0]}, ${colors[1]}, ${colors[2]})`;
    })
}