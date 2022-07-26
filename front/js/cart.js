/**
 * Get product's data from API
 * @function getOneProduct @param {*} id of the interested product
 * @async function
 * @return promise
 */
async function getOneProduct(id) {
  const urlOneProduct = `http://localhost:3000/api/products/${id}`;
  const oneProduct = await fetch(urlOneProduct);
  const oneProductParse = await oneProduct.json();
  return oneProductParse;
}

/**
 * @function modifyQuantity which let the user changed the product's quantity, displayed and saved it in localStorage
 * @param {*} newQuantityValue : e.target.value : the value obtained in the input at the time of the event = the user modifying the product's quantity
 * @param {*} productId : id of the product user changed the quantity
 * @param {*} productColor : color of the product user changed the quantity
 * @returns new value of product's quantity displayed and saved in the localStorage
 */
function modifyQuantity(newQuantityValue, productId, productColor) {
  let productsInLocalStorage = JSON.parse(localStorage.getItem("sofa"));

  // Find the product the user want to change the quantity, by searching in the localStorage's array with the product's id and color
  let foundProduct = productsInLocalStorage.find(
    (p) => p.id === productId && p.color === productColor
  );
  foundProduct.quantity = newQuantityValue; // make the quantity selected by the user the same as the quantity of the same product in the localStorage
  localStorage.setItem("sofa", JSON.stringify(productsInLocalStorage));

  // If the product's quantity is = 0 or is negative, the product is deleted from the cart
  if (newQuantityValue < 1) {
    deleteItem(productId, productColor);
  }

  // Update total price and quantity of the cart
  updateDisplayTotalQuantity();
  updateDisplayTotalPrice();
}

/**
 *@function updateDisplayTotalQuantity which update the total price of the cart
 */
function updateDisplayTotalQuantity() {
  let getProductsInLocalStorage = JSON.parse(localStorage.getItem("sofa"));
  let totalQuantity = 0;

  for (let product of getProductsInLocalStorage) {
    let productQuantity = parseInt(product.quantity); // Using parseInt() to translate string into number
    totalQuantity += productQuantity;
  }

  // Display the total quantity
  document.getElementById("totalQuantity").innerHTML = totalQuantity;
}

/**
 * Display total price of the cart
 * @async function to get product's data from the API
 * @function updateDisplayTotalPrice which calculate the price with product's number in cart and their price
 */
async function updateDisplayTotalPrice() {
  let getProductsInLocalStorage = JSON.parse(localStorage.getItem("sofa"));
  let totalPrice = 0;

  for (let product of getProductsInLocalStorage) {
    let productInfo = await getOneProduct(product.id);
    let productQuantity = parseInt(product.quantity); // using parseInt() to translate string into number
    let price = productQuantity * productInfo.price;
    totalPrice += price;
  }

  // Display the price
  document.getElementById("totalPrice").innerHTML = totalPrice;
}

/**
 * @function deleteItem which delete product chosen by the user in cart
 * @param {*} productId : id of the product user want to delete
 * @param {*} productColor : color of the product user want to delete
 */
function deleteItem(productId, productColor) {
  let productsInLocalStorage = JSON.parse(localStorage.getItem("sofa"));

  // Find the index in the localStorage's array of the product the user want to delete
  let foundIndexProduct = productsInLocalStorage.findIndex(
    (p) => p.id === productId && p.color === productColor
  );
  productsInLocalStorage.splice(foundIndexProduct, 1); // allow to delete one product with the product's index

  // Save in localStorage
  localStorage.setItem("sofa", JSON.stringify(productsInLocalStorage));

  // remove the element from the DOM, so that it's no longer displayed
  let elt = document.querySelector(
    `[data-id="${productId}"][data-color="${productColor}"]`
  );
  elt.remove();

  // Upadate total quantity and price of the cart
  updateDisplayTotalQuantity();
  updateDisplayTotalPrice();
}

/**
 * Display product as an array in cart
 * @function main which display, modify or remove products from the cart, count how many product is in the cart and the total cost using functions
 * @async to get the product's sensitive data like the price, from API
 */
async function main() {
  let getProductsInLocalStorage = JSON.parse(localStorage.getItem("sofa"));

  // For each product in the localStorage :
  for (let product of getProductsInLocalStorage) {
    let productInfo = await getOneProduct(product.id); // get the product's data from API

    // Creation <article> and his attributes //
    const createArticle = document.createElement("article");
    createArticle.setAttribute("class", "cart__item");
    createArticle.setAttribute("data-id", product.id);
    createArticle.setAttribute("data-color", product.color);
    document.getElementById("cart__items").appendChild(createArticle);

    // Creation <article>'s childs elements using localStorage and API //
    createArticle.innerHTML = `<div class="cart__item__img">
                                <img src=${product.urlImg} alt=${product.altTxt}>
                              </div>
                              <div class="cart__item__content">
                                <div class="cart__item__content__description">
                                    <h2 class="product__name">${product.name}</h2>
                                    <p>${product.color}</p>
                                    <p> ${productInfo.price} €</p>
                                </div>
                                <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                        <p>Qté : </p>
                                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value =${product.quantity}>
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                        <p class="deleteItem">Supprimer</p>
                                    </div>
                                </div>
                              </div>`;

    // Create a constante variable for a selector which contain id and color of the product
    const productSelector = `[data-id="${product.id}"][data-color="${product.color}"]`;

    // Modify the display of the product's quantity using a function, and save it in localStorage
    const inputQty = document.querySelector(`${productSelector} .itemQuantity`); // to get the item that interests us for each article
    inputQty.addEventListener("change", (e) => {
      modifyQuantity(e.target.value, product.id, product.color);
    });

    // Delete item by click on btn
    const deleteBtn = document.querySelector(`${productSelector} .deleteItem`); // to get the item to delete each article
    deleteBtn.addEventListener("click", (e) => {
      deleteItem(product.id, product.color);
    });
  }
  updateDisplayTotalQuantity(); // Display the total quantity of products in cart, update itself
  updateDisplayTotalPrice(); // Display the total price of the cart, update itself
}
main();

/**
 * Validation of the form using regExp in checkfunctions of inputs
 * @function check for each input, checking if input's value are correct
 */
// get the form element in DOM
const form = document.querySelector(".cart__order__form");

// Check First name input
form.firstName.setAttribute("placeholder", "Saisir un prénom");
form.firstName.addEventListener("change", (e) => {
  e.preventDefault();
  checkFirstName(form.firstName);
});
function checkFirstName(FirstNameInput) {
  const nameRegExp = new RegExp("^[a-zA-ZÀ-ÿ ,.'-]+$");
  let testFirstName = nameRegExp.test(FirstNameInput.value);
  let msgError = document.getElementById("firstNameErrorMsg");
  // if test isn't true (meaning validated by RexExp) throw an error msg
  if (!testFirstName) {
    msgError.innerHTML = "Saisie incorrect";
  } else {
    msgError.innerHTML = "";
  }
}

// Check last name input
form.lastName.setAttribute("placeholder", "Saisir un nom");
form.lastName.addEventListener("change", (e) => {
  e.preventDefault();
  checkLastName(form.lastName);
});
function checkLastName(LastNameInput) {
  const nameRegExp = new RegExp("^[a-zA-ZÀ-ÿ ,.'-]+$");
  let testLastName = nameRegExp.test(LastNameInput.value);
  let msgError = document.getElementById("lastNameErrorMsg");
  // if test isn't true (meaning validated by RexExp) throw an error msg
  if (!testLastName) {
    msgError.innerHTML = "Saisie incorrect, ne comporte que des majuscules";
  } else {
    msgError.innerHTML = "";
  }
}

// Check the address
form.address.setAttribute("placeholder", "Saisir une adresse");
form.address.addEventListener("change", (e) => {
  e.preventDefault();
  checkAddress(form.address);
});
function checkAddress(addressInput) {
  const addressRegExp = new RegExp("^[a-zA-Z0-9s,. '-]{3,}$");
  let testAddress = addressRegExp.test(addressInput.value);
  let msgError = document.getElementById("addressErrorMsg");
  // if test isn't true (meaning validated by RexExp) throw an error msg
  if (!testAddress) {
    msgError.innerHTML = "Ceci n'est pas une adresse correcte";
  } else {
    msgError.innerHTML = "";
  }
}

// Check the city
form.city.setAttribute("placeholder", "Saisir une ville et un code postale");
form.city.addEventListener("change", (e) => {
  e.preventDefault();
  checkCity(form.city);
});

function checkCity(cityInput) {
  const cityRegExp = new RegExp(
    "^[a-zA-Z0-9s,. '-]{3,}(([1-95]{2}|2A|2B)[0-9]{3})$|^[971-974]$"
  );
  let testCity = cityRegExp.test(cityInput.value);
  let msgError = document.getElementById("cityErrorMsg");
  // if test isn't true (meaning validated by RexExp) throw an error msg
  if (!testCity) {
    msgError.innerHTML =
      "Saisie incorrect, doit comporter ville et code postale";
  } else {
    msgError.innerHTML = "";
  }
}

// Check email
form.email.setAttribute("placeholder", "Saisir une adresse email");
form.email.addEventListener("change", (e) => {
  e.preventDefault();
  checkEmail(form.email);
});
function checkEmail(emailInput) {
  const emailRegExp = new RegExp(`[a-z0-9]+@[a-z]+\.[a-z]{2,3}`);
  let testEmail = emailRegExp.test(emailInput.value);
  let msgError = document.getElementById("emailErrorMsg");
  // if test isn't true (meaning validated by RexExp) throw an error msg
  if (!testEmail) {
    msgError.innerHTML = "Saisie email incorrect";
  } else {
    msgError.innerHTML = "";
  }
}

/**
 * Send the request to API
 */

// make en request to send the info to the API, in exchange of an order number
async function postOrder() {
  const urlPostOrder = "http://localhost:3000/api/products/order";
  // Creation of an array of the products in the cart
  let productsInLocalStorage = JSON.parse(localStorage.getItem("sofa"));
  const productsOrder = [];
  for (let idproducts of productsInLocalStorage) {
    productsOrder.push(idproducts.id);
  }
  const postOrderFetch = await fetch(urlPostOrder, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contact: {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value,
      },
      products: productsOrder,
    }),
  });

  const postOrderParse = await postOrderFetch.json();
  return postOrderParse;
}

document.getElementById("order").addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const getPostOrder = await postOrder();
    console.log(getPostOrder);
    const orderId = getPostOrder.orderId;
    console.log(orderId);
    window.location.href = `confirmation.html?id=${orderId}`;
    localStorage.clear("sofa");
    document.querySelector("cart__order__form").reset();
  } catch (err) {
    console.log("err get postOrder");
  }
});
