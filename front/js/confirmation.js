/**
 * Get the query string of the current page's URL
 * Get the interested data = product's ID = idProduct
 * @constructor { URLSearchParams() }
 * @param { url }
 */
const queryString_URLOrderId = window.location.search;
let urlParamSearch = new URLSearchParams(queryString_URLOrderId);
let orderId = urlParamSearch.get("id");
// display order's id on page
document.getElementById("orderId").innerHTML = `${orderId}`;
