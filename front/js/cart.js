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
