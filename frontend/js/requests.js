import { dateToFormattedString, showToasty } from "./utils.js";

export const clientsEndPoint = "";
export const ordersEndPoint = "";

//Client Requests
export function getClientsByName(clientName) {

    //NAMES TO APPEAR IN SEARCH IN FLUTUATIVE MODAL
    // SELECT * FROM CLIENTS WHERE NAME LIKE %CLIENTNAME%

    let resultSet = [ "Thiago", "Murilo", "Zezinho", "Seu Zé" ];

    return resultSet;
    //else { showToasty("Cliente não encontrado", "error"); }


}

export function getClientsByNameLike(clientName) {

    // SELECT * FROM CLIENTS WHERE NAME LIKE %CLIENTNAME%

    let clientModel = {
        id                  :"0",
        name             :   "Thiago",
        phone1           :   "11981951752",
        phone2            :   "",
        phone3            :   "",
        address           :   "",
        documentNumber    :   "43681781818"
    };

  
    let random = 1000 + Math.floor(Math.random() * 3000);

    let clients = [];
       
    for (let index = 0; index < random; index++) {

        clients[index] = JSON.parse(JSON.stringify(clientModel));

    }

    return clients;

}

export function getAllClients() {

    let clientModel = {
        id                  :"0",
        name             :   "Thiago",
        phone1           :   "11981951752",
        phone2            :   "",
        phone3            :   "",
        address           :   "",
        documentNumber    :   "43681781818"
    };

  
    let random = 1000 + Math.floor(Math.random() * 3000);

    let clients = [];
       
    for (let index = 0; index < random; index++) {

        clients[index] = JSON.parse(JSON.stringify(clientModel));

    }

    return clients;

}

export function getClientByName(clientName) {

    let client = {
        id                  :"0",
        name             :   clientName,
        phone1           :   "11981951752",
        phone2            :   "",
        phone3            :   "",
        address           :   "",
        documentNumber    :   "43681781818"
    };

    let array = [];
    array[0] = JSON.parse(JSON.stringify(client));

    return array;

}


export function postClient(clientJSON) {

    //POST 
    return true;

}

//Order Requests

export function postOrder(orderJSON) {

    //POST ORDER

    orderJSON = JSON.parse(orderJSON);

    let savedOrder = orderJSON;
    savedOrder.number = 10;

    localStorage.setItem(savedOrder.number, JSON.stringify(savedOrder));

    showToasty("OS N°" + savedOrder.number + " salva com sucesso!")
    //IF SAVE RETURN NUMBER OR SHOWTOASTY ERROR
    return savedOrder.number;

}

export function getOrders(searchCriteriaJSON) {

    console.log(searchCriteriaJSON);

    let order = JSON.parse(localStorage.getItem("10"));

    order.date = dateToFormattedString(null);
    order.number = 1;

    let random = 500 + Math.floor(Math.random() * 3000);

    let orders = [];

    for (let i = 0; i < random; i++) {
        orders[i] = JSON.parse(JSON.stringify(order));
        order.number++;
    }

    return orders;

}

export function putOrder(orderJSON) {

    if (true) {
        showToasty("OS N°" + JSON.parse(orderJSON).number + " salva com sucesso!");
  }

  return true;

}

