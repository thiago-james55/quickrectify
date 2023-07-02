
import { dateToFormattedString } from "./utils.js";

window.onload = () => {

    getOrderBySessionOrByGet();
   
}

function getOrderBySessionOrByGet() {

    const urlParams = new URLSearchParams(window.location.search);
    let orderNumber = urlParams.get("orderNumber");
    let order = localStorage.getItem(orderNumber);

    document.title = "Nota N°" + orderNumber;
    
    if (order) {
        var objectOrder = JSON.parse(order);
        objectOrder.date = dateToFormattedString();
        objectOrder.number = orderNumber;
        constructOrderByObjectOrder(objectOrder);
    } else {
        //GET BY ORDERNUMBER
    }
}

function constructOrderByObjectOrder(order) {

    console.log(order);

    let  noteInfo = document.getElementById("noteInfo");
    let clientName = document.getElementById("clientName");
    let clientInformation = document.getElementById("clientInformation");

    let noteDescription = document.getElementById("noteDescription");
    let partsTable = document.getElementById("partsTable");

    let subTotal = document.getElementById("subTotal");
    let discountPercent = document.getElementById("discountPercent");
    let discountValue = document.getElementById("discountValue");
    let total = document.getElementById("total");
   
    noteInfo.textContent = "OS Nº" + order.number + " - " + order.date;
    clientName.textContent = order.clientName;
    clientInformation.textContent = "Telefone1: 2052-6193";

    noteDescription.textContent = order.description;

    addPartsToTable(partsTable,order.parts);

    subTotal.textContent += order.subTotal;
    discountPercent.textContent += order.discountPercent;
    discountValue.textContent += order.discountValue;
    total.textContent += order.total;



}

function addPartsToTable(partsTable, parts) {

    for (let part of parts) {

        let row  = partsTable.insertRow();

        part = Object.values(part);
        
        for (let i = 0; i < part.length; i++) {

            let span = document.createElement("span");
            span.textContent = part[i];

            let cell = row.insertCell();
            cell.appendChild(span);
        }
        

    }

    
}

