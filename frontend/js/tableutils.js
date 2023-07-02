export const partType = ["Bielas", "Bloco", "Cabeçote", "Solda", "Virabrequim", "Volante", "Outros"];
export const partService = [
    ["Banho", "Retificar", "Só Ferro", "Venda", "Outros"],
    ["Abrir", "Banho", "Brunir", "Encamisar", "Mandrilhar", "Plainar", "Soldar", "Outros"],
    ["Banho", "Completo", "Mandrilhar", "Plainar", "Regular", "Soldar", "Venda", "Outros"],
    ["Alumínio", "Ferro", "Magnésio"],
    ["Banho", "Polir", "Retificar", "Tratar", "Venda", "Outros"],
    ["Banho", "Retificar", "Virar Engrenagem", "Outros"],
    ["Montar Pistões", "Tornear Bronzina", "Venda", "Outros"]
];

export const tableParts = document.getElementById("tableParts");
export const orderSubTotal = document.getElementById("orderSubTotal");
export const orderDiscountPercent = document.getElementById("orderDiscountPercent");
export const orderDiscountValue = document.getElementById("orderDiscountValue")
export const orderTotal = document.getElementById("orderTotal");

export function clearTable() {

    while ( tableParts.rows.length > 1 ) {
        tableParts.deleteRow(tableParts.rows.length-1);
    }
}

export function buttonPartListeners() {
    document.getElementById("buttonPartBielas").addEventListener("click", function () { addPart(this) });
    document.getElementById("buttonPartBloco").addEventListener("click", function () { addPart(this) });
    document.getElementById("buttonPartCabeçote").addEventListener("click", function () { addPart(this) });
    document.getElementById("buttonPartSolda").addEventListener("click", function () { addPart(this) });
    document.getElementById("buttonPartVirabrequim").addEventListener("click", function () { addPart(this) });
    document.getElementById("buttonPartVolante").addEventListener("click", function () { addPart(this) });
    document.getElementById("buttonPartOutros").addEventListener("click", function () { addPart(this) });
}

export function addPart(part) {

    switch (part.id) {

        case "buttonPartBielas":
            addPartToTable(0);
            break;

        case "buttonPartBloco":
            addPartToTable(1);
            break;

        case "buttonPartCabeçote":
            addPartToTable(2);
            break;

        case "buttonPartSolda":
            addPartToTable(3);
            break;

        case "buttonPartVirabrequim":
            addPartToTable(4);
            break;

        case "buttonPartVolante":
            addPartToTable(5);
            break;

        case "buttonPartOutros":
            addPartToTable(6);
            break;

    }

}

export async function addPartToTable(typeIndex,serviceIndex,partDescription,partQuantity,partUnityPrice,partTotal) {

    let row = tableParts.insertRow();

    //Group
    let cellGroup = row.insertCell();
    let localGroup = document.createElement("span");

    localGroup.innerText = partType[typeIndex];


    localGroup.setAttribute("id", "cellSpan");

    cellGroup.appendChild(localGroup);

    //Service
    let cellService = row.insertCell();
    createServiceOptions(typeIndex, cellService,serviceIndex);


    let cellDescription = row.insertCell();
    let localInputDescription = document.createElement("input");
    if (partDescription) localInputDescription.value = partDescription;
    cellDescription.appendChild(localInputDescription);

    let cellQuantityUnit = row.insertCell();
    let localQuantityUnit = document.createElement("input");
    localQuantityUnit.setAttribute("id", "cellQuantity");
    localQuantityUnit.setAttribute("type", "number");
    localQuantityUnit.setAttribute("step", "1");
    localQuantityUnit.value = 1;
    if (partQuantity) localQuantityUnit.value = partQuantity;
    cellQuantityUnit.appendChild(localQuantityUnit);

    let cellUnitPrice = row.insertCell();
    let localUnitPrice = document.createElement("input");
    localUnitPrice.setAttribute("id", "cellPriceQuantity");
    localUnitPrice.setAttribute("type", "number");
    localUnitPrice.setAttribute("step", "5.00");
    localUnitPrice.value = partUnityPrice ? partUnityPrice : "0.00";
    cellUnitPrice.appendChild(localUnitPrice);

    let cellTotalPrice = row.insertCell();
    let localTotalPrice = document.createElement("input");
    localTotalPrice.setAttribute("id", "cellTotalPrice");
    localTotalPrice.setAttribute("type", "number");
    localTotalPrice.setAttribute("disabled", "true");
    localTotalPrice.value = partTotal ? partTotal : "0.00";
    cellTotalPrice.appendChild(localTotalPrice);

    let cellButtonRemove = row.insertCell();
    let localButtonRemove = document.createElement("button");
    localButtonRemove.innerText = "X";
    localButtonRemove.classList.add("cellButton");
    localButtonRemove.setAttribute("type", "button");

    cellButtonRemove.appendChild(localButtonRemove);


    localButtonRemove.addEventListener("click", function (e) {

        let row = e.target.parentNode.parentNode.rowIndex;
        tableParts.deleteRow(row);
        sumTotalOrder();
    });

    //onChangeValuesOfCell

    localQuantityUnit.addEventListener("change", function (e) {

        let row = e.target.parentNode.parentNode;
        let unit = row.cells[3].children[0].value;
        let unitPrice = row.cells[4].children[0].value;

        row.cells[4].children[0].value = parseFloat(unitPrice).toFixed(2);

        row.cells[5].children[0].value = parseFloat(unit * unitPrice).toFixed(2);

        sumTotalOrder();

    });


    localUnitPrice.addEventListener("change", function (e) {

        let row = e.target.parentNode.parentNode;
        let unit = row.cells[3].children[0].value;
        let unitPrice = row.cells[4].children[0].value;

        row.cells[4].children[0].value = parseFloat(unitPrice).toFixed(2);

        row.cells[5].children[0].value = parseFloat(unit * unitPrice).toFixed(2);

        sumTotalOrder();

    });

}

export function createServiceOptions(typeIndex, cellService, serviceIndex) {

    let localSelect = document.createElement('select');

    for (let i = 0; i < partService[typeIndex].length; i++) {

        let local = document.createElement('option');
        local.text = partService[typeIndex][i];
        localSelect.add(local);
        if (serviceIndex && serviceIndex == i) {
            local.selected = true;
        }
        
    }

    cellService.appendChild(localSelect);

}

export function sumTotalOrder() {

    if (tableParts.rows.length > 1) {

        let total = 0;

        for (let index = 1; index < tableParts.rows.length; index++) {
            total += parseFloat(tableParts.rows[index].cells[5].children[0].value);
            orderSubTotal.value = parseFloat(total).toFixed(2);
        }

        if (orderDiscountPercent.value > 0 || orderDiscountValue.value > 0) {

            if (orderDiscountPercent.value > 0) {
                total -= orderDiscountPercent.value * (total / 100);
            }

            if (orderDiscountValue.value > 0) {
                total -= parseFloat(orderDiscountValue.value);
            }

        }

        orderTotal.value = parseFloat(total).toFixed(2);

    } else {
        orderSubTotal.value ="0.00";
        orderTotal.value = "0.00";
    }


}

export function generateJsonFromInputs(clientName, description, orderNumber) {

    clientName = clientName ? clientName : inputSearchClient.value;
    description = description ? description : document.getElementById("inputGeralDescription").value;
    let parts = [];

    for (let i = 1; i < tableParts.rows.length; i++) {

        let row = tableParts.rows[i];

        let selectedIndex = row.children[1].children[0].selectedIndex;

        parts[i - 1] = {
            "partType": row.children[0].children[0].textContent,
            "partService": row.children[1].children[0].options[selectedIndex].text,
            "partDescription": row.children[2].children[0].value,
            "partQuantity": row.children[3].children[0].value,
            "partUnityPrice": parseFloat(row.children[4].children[0].value).toFixed(2),
            "partTotal": parseFloat(row.children[5].children[0].value).toFixed(2)
        };

    }

    let subTotal = orderSubTotal.value;
    let discountPercent = orderDiscountPercent.value;
    let discountValue = orderDiscountValue.value;
    let total = orderTotal.value;

    let order = {
        "number" : orderNumber ? orderNumber : null,
        "clientName": clientName,
        "description": description,
        "parts": parts,
        "subTotal": subTotal,
        "discountPercent": discountPercent,
        "discountValue": discountValue,
        "total": total
    };


    return JSON.stringify(order);

}
