import { showToasty } from "./utils.js";
import { getClientsByName, postClient } from "./requests.js";

export const inputSearchClient = document.getElementById("inputSearchClient");

export function searchClient() {
    getClientsByNameLike(inputSearchClient.value);
}

export function getClientsByNameLike(clientName) {

    let resultSet = getClientsByName(clientName);

    if ( resultSet ) { fillClientDialog(resultSet); }

}

export function fillClientDialog(clientNames) {

    let modalSearchClient = document.getElementById("modalSearchClient");
    let divSearchClient = document.getElementById("searchClient");

    while (divSearchClient.firstChild) {
        divSearchClient.removeChild(divSearchClient.lastChild);
    }

    let h1Title = document.createElement("h1");
    h1Title.textContent = "Clientes encontrados:";

    divSearchClient.appendChild(h1Title);


    clientNames.forEach(element => {

        let p = document.createElement("p");
        p.textContent = element;
        p.addEventListener("click", () => {
            inputSearchClient.value = element;
            modalSearchClient.close();
            inputSearchClient.dispatchEvent(new CustomEvent("change"));
        });

        divSearchClient.appendChild(p);

    });

    modalSearchClient.showModal();
    modalSearchClient.addEventListener('click', () => modalSearchClient.close());

}

export function newClient() {
    
    let modalEditClient = document.getElementById("modalEditClient");
    modalEditClient.clientID = null;

    let divEditClient = document.getElementById("editClient");
    modalEditClient.showModal();

    modalEditClient.addEventListener('click', () => modalEditClient.close());
    divEditClient.addEventListener('click', (event) => event.stopPropagation());

}

export function saveClient() {
    let id = document.getElementById("modalEditClient").clientID;
    let clientName = document.getElementById("clientName");
    let clientPhone1 = document.getElementById("clientPhone1");
    let clientPhone2 = document.getElementById("clientPhone2");
    let clientPhone3 = document.getElementById("clientPhone3");
    let clientAddress = document.getElementById("clientAddress");
    let clientDocumentNumber = document.getElementById("clientDocumentNumber");

    if (checkClientBasicsAreInformed(clientName, clientPhone1, clientDocumentNumber)) {

        let clientInformation = {
            "id" : id ? id : null,
            "name": clientName.value ,
            "phone1": clientPhone1.value ,
            "phone2": clientPhone2.value ,
            "phone3": clientPhone3.value ,
            "address": clientAddress.value ,
            "documentNumber": clientDocumentNumber.value
        };

        
        if ( postClient(clientInformation) ) {
            showToasty("Cliente " + clientName.value + " salvo com sucesso!");
            document.getElementById("modalEditClient").close();
            inputSearchClient.value = clientName.value;
        } else {
            showToasty("Erro ao salvar cliente", "error");
        }

    } else {
        showToasty("Os campos: Nome, Telefone 1 e CPF/CNPJ são obrigatórios!", "error");
    }

}

export function checkClientBasicsAreInformed(clientName, clientPhone1, clientDocumentNumber) {
    return clientName.value.length > 3 &&
        clientPhone1.value.length > 7 &&
        clientDocumentNumber.value.length > 9;
}