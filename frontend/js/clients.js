import { searchClient,newClient,saveClient } from "./clientutils.js"; 
import { getAllClients, getClientByName } from "./requests.js";
import { dateToFormattedString } from "./utils.js";

const clientsTable = document.getElementById("clientsTable");
var clients = [];

window.onload = () => {

    addEventListeners();   
    if ( !loadUrlParams() ) { loadAllClients(); }

}

function loadUrlParams() {

    let urlParams = new URLSearchParams(window.location.search);
    let client = urlParams.get("client");

    if (client) {
        inputSearchClient.value = client;
        loadClientByName(client);
        return true;
    } else {
        return false;
    }

}

function loadClientByName (clientName) {
    clients = getClientByName(clientName);
    loadClients();
}

function loadClientByNameLike (clientName) {
    clients = getClientsByNameLike(clientName);
    loadClients();
}

function loadAllClients() {
    clients = getAllClients();
    loadClients();
}

function loadClients() {
    
    clearClientsTable();

    if (clients.length > 0) {
        clients.forEach(c => { addClientToTable(c); });
    }
}

function addClientToTable(client) {
    let row = clientsTable.insertRow();

    let cellID = row.insertCell();
    let cellDate = row.insertCell();
    let cellName = row.insertCell();
    let cellPhone1 = row.insertCell();
    let cellPhone2 = row.insertCell();
    let cellPhone3 = row.insertCell();
    let cellAddress = row.insertCell();
    let cellDocumentNumber = row.insertCell();
    let cellEditClient = row.insertCell();
    let cellSearchOrders = row.insertCell();

    let ID = document.createElement("span");
    let date = document.createElement("span");
    let name = document.createElement("span");
    let phone1 = document.createElement("span");
    let phone2 = document.createElement("span");
    let phone3 = document.createElement("span");
    let address = document.createElement("span");
    let documentNumber = document.createElement("span");
    let buttonEditClient = document.createElement("button");
    let buttonSearchOrders = document.createElement("button");

    ID.textContent = client.id;
    date.textContent = dateToFormattedString(null);
    name.textContent = client.name;
    phone1.textContent = client.phone1;
    phone2.textContent = client.phone2;
    phone3.textContent = client.phone3;
    address.textContent = client.address;
    documentNumber.textContent = client.documentNumber;

    buttonEditClient.clientID = client.id;
    buttonSearchOrders.clientName = client.name;

    buttonEditClient.addEventListener("click" , function() {
        editClient(this.clientID);
    } );

    buttonSearchOrders.addEventListener("click" , function() {
        searchOrders(this.clientName);
    } );

    buttonEditClient.textContent = "✎";
    buttonSearchOrders.textContent = "🔍︎";

    buttonEditClient.classList.add("cellButton");
    buttonSearchOrders.classList.add("cellButton");



    cellID.appendChild(ID);
    cellDate.appendChild(date);
    cellName.appendChild(name);
    cellPhone1.appendChild(phone1);
    cellPhone2.appendChild(phone2);
    cellPhone3.appendChild(phone3);
    cellAddress.appendChild(address);
    cellDocumentNumber.appendChild(documentNumber);
    cellEditClient.appendChild(buttonEditClient);
    cellSearchOrders.appendChild(buttonSearchOrders);




}

function clearClientsTable() {
    
    while ( clientsTable.rows.length > 1 ) {
        clientsTable.deleteRow(clientsTable.rows.length-1);
    }
    
}

function editClient(clientId) {
    
    newClient();

    document.getElementById("modalEditClient").clientID = clientId;

    let editClientTitle = document.getElementById("editClientTitle");
    let clientName = document.getElementById("clientName");
    let clientPhone1 = document.getElementById("clientPhone1");
    let clientPhone2 = document.getElementById("clientPhone2");
    let clientPhone3 = document.getElementById("clientPhone3");
    let clientAddress = document.getElementById("clientAddress");
    let clientDocumentNumber = document.getElementById("clientDocumentNumber");

    let client = clients.find(c => c.id === clientId)

   
    editClientTitle.textContent = "Editar Cliente: N°" + client.id;
    clientName.value = client.name;
    clientPhone1.value = client.phone1;
    clientPhone2.value = client.phone2;
    clientPhone3.value = client.phone3;
    clientAddress.value = client.address;
    clientDocumentNumber.value = client.documentNumber;



}

function searchOrders(clientName) {
    window.location.href = "./listOrders.html?client=" + clientName;
}


function addEventListeners() {
    
    document.getElementById("inputSearchClient").addEventListener("change", function () { loadClientByNameLike(this.value) });

    document.getElementById("buttonSearchClient").addEventListener("click", function () { searchClient() });
    document.getElementById("buttonNewClient").addEventListener("click", function () { newClient() });
    document.getElementById("buttonSaveClient").addEventListener("click", function () { saveClient() });
}