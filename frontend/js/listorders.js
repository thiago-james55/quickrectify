import { addPartToTable, buttonPartListeners, clearTable, generateJsonFromInputs, orderDiscountPercent, orderDiscountValue, orderSubTotal, orderTotal, partService, partType, tableParts } from "./tableutils.js";
import { dateToFormattedString, showToasty,noteURI } from "./utils.js";
import { searchClient, inputSearchClient } from "./clientutils.js";
import { getOrders, putOrder } from "./requests.js";

var partsTable;
var orders = [];

window.onload = () => {

    partsTable = document.getElementById("partsTable");
    addEventListeners(); 

    if ( loadUrlParams() ) { 
        getOrdersByCriteria(); 
    } else {
        orders = getOrders(null);
        loadOrders();   
    }   

}

function loadUrlParams() {

    let urlParams = new URLSearchParams(window.location.search);
    let client = urlParams.get("client");

    if (client) {
        inputSearchClient.value = client;
        return true;
    } else {
        return false;
    }

}

async function loadOrders() {

    if (orders < 1) { return; }

    clearPartsTable();

    for (let index = 0; index < orders.length; index++) {
        addOrderToTable(orders[index]);
    }

    var objDiv = document.getElementById("partsList");
    objDiv.scrollTop = objDiv.scrollHeight;

}


async function getOrdersByCriteria() {

    let selectMonthSearch = document.getElementById("selectMonthSearch");
    let inputInitialDateSearch = document.getElementById("inputInitialDateSearch");
    let inputFinalDateSearch = document.getElementById("inputFinalDateSearch");
    let selectPartSearch = document.getElementById("selectPartSearch");
    let inputClientNameSearch = inputSearchClient; 

    if (inputInitialDateSearch.valueAsNumber > inputFinalDateSearch.valueAsNumber) {
        showToasty("Data inicial não pode ser maior que data final!", "error");
        return;
    }

    let month = selectMonthSearch.options[selectMonthSearch.selectedIndex].textContent;
    let initialDateSearch = inputInitialDateSearch.value;
    let finalDateSearch = inputFinalDateSearch.value;
    let partSearch = selectPartSearch.options[selectPartSearch.selectedIndex].textContent;
    let clientNameSearch = inputClientNameSearch.value;


    let search = {  "month" : month,
                    "initialDateSearch" : initialDateSearch,
                    "finalDateSearch" : finalDateSearch,
                    "partSearch" : partSearch,
                    "clientNameSearch" : clientNameSearch
                };
            
    orders = await getOrders(search);

    loadOrders();

}

function clearPartsTable() {

    while ( partsTable.rows.length > 1 ) {
        partsTable.deleteRow(partsTable.rows.length-1);
    }
}

async function addOrderToTable(order) {

    
    for (let index = 0; index < order.parts.length; index++) {

        let row = partsTable.insertRow();

        let cellDate = row.insertCell();
        let cellNumber = row.insertCell();
        let cellClientName = row.insertCell();
        let cellDescription = row.insertCell();
        let cellPartType = row.insertCell();
        let cellPartService = row.insertCell();
        let cellPartDescription = row.insertCell();
        let cellPartQuantity = row.insertCell();
        let cellPartUnityPrice= row.insertCell();
        let cellPartTotal = row.insertCell();

        let cellOrderEdit = row.insertCell();
        let cellOrderPrint = row.insertCell();

        let spanDate = document.createElement("span");
        let spanNumber = document.createElement("span");
        let aClientName = document.createElement("a");
        let spanDescription = document.createElement("span");
        let spanPartType = document.createElement("span");
        let spanPartService = document.createElement("span");
        let spanPartDescription = document.createElement("span");
        let spanPartQuantity = document.createElement("span");
        let spanPartUnityPrice = document.createElement("span");
        let spanPartTotal = document.createElement("span");

        spanDate.textContent = dateToFormattedString(new Date(order.date));
        spanNumber.textContent = order.number;
        aClientName.textContent = order.clientName;
        aClientName.href = "./clients.html?client=" + order.clientName;
        spanDescription.textContent = order.description.length > 50 ? order.description.substring(0,50) + "..." : order.description;
        spanDescription.title = order.description.length > 50 ? order.description : "";
        spanPartType.textContent = order.parts[index].partType;
        spanPartService.textContent = order.parts[index].partService;
        spanPartDescription.textContent = order.parts[index].partDescription;
        spanPartQuantity.textContent = order.parts[index].partQuantity;
        spanPartUnityPrice.textContent = order.parts[index].partUnityPrice;
        spanPartTotal.textContent = order.parts[index].partTotal;
        
        let buttonOrderEdit = document.createElement("button");
        let buttonOrderPrint = document.createElement("button");

        buttonOrderEdit.orderNumber = order.number;
        buttonOrderPrint.orderNumber = order.number;

        buttonOrderEdit.addEventListener("click", function() {
            editOrder(this.orderNumber);
        })

        buttonOrderPrint.addEventListener("click", function() {
            printOrder(this.orderNumber);
        })

        buttonOrderEdit.textContent = "✎";
        buttonOrderPrint.textContent = "🖶";

        buttonOrderEdit.classList.add("cellButton");
        buttonOrderPrint.classList.add("cellButton");

        cellDate.appendChild(spanDate);
        cellNumber.appendChild(spanNumber);
        cellClientName.appendChild(aClientName);
        cellDescription.appendChild(spanDescription);
        cellPartType.appendChild(spanPartType);
        cellPartService.appendChild(spanPartService);
        cellPartDescription .appendChild(spanPartDescription);
        cellPartQuantity.appendChild(spanPartQuantity);
        cellPartUnityPrice.appendChild(spanPartUnityPrice);
        cellPartTotal.appendChild(spanPartTotal);
        
        cellOrderEdit.appendChild(buttonOrderEdit);
        cellOrderPrint.appendChild(buttonOrderPrint);

                
    }
    
}

function editOrder(orderNumber) {

    clearTable();

    let modalEditOrder = document.getElementById("modalEditOrder");
    let divEditOrder = document.getElementById("editOrder");
    modalEditOrder.showModal();

    modalEditOrder.addEventListener('click', () => modalEditOrder.close());
    divEditOrder.addEventListener('click', (event) => event.stopPropagation());

    modalEditOrder.orderNumber = orderNumber;

    fillModalOfEditOrder(orderNumber);
}

function fillModalOfEditOrder(orderNumber) {

    let order = orders.find(o => o.number === orderNumber);
    
    let editOrderTitle = document.getElementById("editOrderTitle");
    editOrderTitle.innerText = "Editar OS N°" + orderNumber;
    
    let editOrderDate = document.getElementById("editOrderDate");
    editOrderDate.value = order.date;

    let editOrderClient = document.getElementById("editOrderClient");
    editOrderClient.value = order.clientName;

    let editOrderDescription = document.getElementById("editOrderDescription");
    editOrderDescription.value = order.description;

    addPartsOfOrderToEditModal(order.parts);

    orderSubTotal.value = order.subTotal;
    orderDiscountPercent.value = order.discountPercent;
    orderDiscountValue.value = order.discountValue;
    orderTotal.value = order.total;

    document.getElementById("buttonDeleteOrder").innerHTML = "Excluir OS";

}

function addPartsOfOrderToEditModal(parts) {

    parts.forEach(part => {

        let typeIndex = getPartTypeIndexByName(part.partType);
        let serviceIndex = getPartServiceIndexByName(typeIndex,part.partService);

        let partDescription = part.partDescription;
        let partQuantity = part.partQuantity;
        let partUnityPrice = part.partUnityPrice;
        let partTotal = part.partTotal;

        addPartToTable(typeIndex,serviceIndex,partDescription,partQuantity,partUnityPrice,partTotal);
        
    });
    
}

function getPartTypeIndexByName(typeName) {

    for (let index = 0; index < partType.length; index++) {
        if (typeName == partType[index]) return index;
    }

}

function getPartServiceIndexByName(typeIndex,serviceName){

    for (let index = 0; index < partService[typeIndex].length; index++) {
        if (serviceName == partService[typeIndex][index] ) return index;
    }

}

function printOrder(orderNumber) {
    let order = orders.find(o => o.number === orderNumber);

    localStorage.setItem(orderNumber,JSON.stringify(order));
    window.open(noteURI + "" + orderNumber);
}


function saveEditedOrder() {

    if (!checkIsAValidOrder()) { return;}

    let clientName = editOrderClient.value;
    let description = editOrderDescription.value;
    let orderNumber = document.getElementById("modalEditOrder").orderNumber;

    let savedOrder = putOrder(generateJsonFromInputs(clientName,description,orderNumber));

    if (savedOrder) { 
        loadOrders(); 
        document.getElementById("modalEditOrder").close();
    }
        
}

function deleteOrder() {

    let buttonDeleteOrder = document.getElementById("buttonDeleteOrder");

    if (buttonDeleteOrder.innerHTML ==  "Excluir OS") {
        buttonDeleteOrder.innerHTML = "Clique mais 10 vezes para excluir a OS!";
        buttonDeleteOrder.remainClicks = 10;
        return;
    } else {

        if (buttonDeleteOrder.remainClicks > 1) { 
            buttonDeleteOrder.remainClicks--;
            buttonDeleteOrder.innerHTML = "Clique mais "+ buttonDeleteOrder.remainClicks + " vezes para excluir a OS!";
            return;
        }

        let modalEditOrder = document.getElementById("modalEditOrder");

        let orderNumber = modalEditOrder.orderNumber;

        modalEditOrder.close();

        //DELETE REQUEST && RECONSTRUCT
        showToasty("OS N°" + orderNumber + " deletada com sucesso!")
        buttonDeleteOrder.innerHTML = "Excluir OS";
       
    }

    

}

function checkIsAValidOrder() {
    if (tableParts.rows.length > 1){ return true; } 
    else {
        showToasty("A tabela de peças não pode estar vazia!", "error");
        return false;
    }
}


function addEventListeners() {

    document.getElementById("buttonSaveOrder").addEventListener("click", () => {
        saveEditedOrder();
    });

    document.getElementById("buttonDeleteOrder").addEventListener("click", (e) => {
        deleteOrder();
    });;

    document.getElementById("buttonSearchCriteria").addEventListener("click", () => {
        getOrdersByCriteria();
    });

    document.getElementById("selectMonthSearch").addEventListener("change" , () => {
        document.getElementById("inputInitialDateSearch").value = "";
        document.getElementById("inputFinalDateSearch").value = "";
    });

    document.getElementById("inputInitialDateSearch").addEventListener("change" , () => {
        document.getElementById("selectMonthSearch").selectedIndex = 0;
    });

    document.getElementById("inputFinalDateSearch").addEventListener("change" , () => {
        document.getElementById("selectMonthSearch").selectedIndex = 0;
    });

    document.getElementById("buttonPrint").addEventListener("click" , () => {
        window.print();
    })

    document.getElementById("buttonSearchClient").addEventListener("click", () => {
        searchClient();
    });

    buttonPartListeners();


}
