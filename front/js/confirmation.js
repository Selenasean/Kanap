/**
 *  Get the query string of the current page's URL
 */
const queryString_URLOrderId = window.location.search;
console.log(queryString_URLOrderId);

/**
 * Get the interested data = product's ID = idProduct
 * @constructor { URLSearchParams() }
 * @param { url }
 */
let urlParamSearch = new URLSearchParams(queryString_URLOrderId);
let orderId = urlParamSearch.get("id");
console.log(orderId);

document.getElementById("orderId").innerHTML = `${orderId}`;
