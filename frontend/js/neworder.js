import { noteURI, showToasty } from "./utils.js";
import {
  tableParts,
  buttonPartListeners,
  generateJsonFromInputs,
  clearTable,
} from "./tableutils.js";

import { newClient, searchClient, saveClient } from "./clientutils.js";
import { postOrder } from "./requests.js";



window.onload = () => {

    addEventListeners();
}

function saveOrderAndPrint() {

    if (checkIsAValidOrder()) {
        let orderToSave = generateJsonFromInputs();
        let savedOrderNumber = postOrder(orderToSave);

        if (savedOrderNumber) {
            window.open(noteURI + savedOrderNumber);
            cleanInputs();
        }        
    }

}

function saveOrder() {

    if (checkIsAValidOrder()) {
        let orderToSave = generateJsonFromInputs();
        let savedOrderNumber = postOrder(orderToSave);

        if (savedOrderNumber) {
            cleanInputs();
        }        
    }

}

//AFTER SAVE
function cleanInputs() {
    clearTable();

    let inputs = document.getElementsByTagName("input");
    for (let input of inputs) { input.value = ""; };
}

function checkIsAValidOrder() {
    
    let validOrder = inputSearchClient.value.length > 3 && tableParts.rows.length > 1;

    if (validOrder) { return true; }
    else { showToasty("Nome do cliente e tabela de serviços não pode estar vazia!", "error"); }

    return false;


}

function addEventListeners() {

    document.getElementById("buttonSearchClient").addEventListener("click", function () { searchClient() });
    document.getElementById("buttonNewClient").addEventListener("click", function () { newClient() });
    document.getElementById("buttonSaveClient").addEventListener("click", function () { saveClient() });

    buttonPartListeners();

    document.getElementById("buttonSaveAndPrint").addEventListener("click", function () { saveOrderAndPrint() });
    document.getElementById("buttonOnlySave").addEventListener("click", function () { saveOrder() });



}