export const toastyMessage = document.getElementById("toastyMessage");
export const noteURI = "/note.html?orderNumber=";

export function showToasty(message, type) {

  if (type == "error") {
    toastyMessage.style.backgroundColor = "red";
  } else {
    toastyMessage.style.backgroundColor = "green";
  }

    toastyMessage.innerHTML = message;
  toastyMessage.className = "show";

  setTimeout(function () {
    toastyMessage.className = toastyMessage.className.replace("show", "");
  }, 3000);
}

export function dateValueOfInputToFormattedDate(inputValueDate) {
  
}

export function dateToFormattedString(date) {

  date = date ? date : new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  return day + "/" + (month > 9 ? month : "0" + month) + "/" + year;
}