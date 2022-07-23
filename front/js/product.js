/**
 *  Get the query string of the current page's URL
 */
const queryString_URLIdProduct = window.location.search;
console.log(queryString_URLIdProduct);

/**
 * Get the interested data = product's ID = idProduct
 * @constructor { URLSearchParams() }
 * @param { url }
 */
let urlParamSearch = new URLSearchParams(queryString_URLIdProduct);
let idProduct = urlParamSearch.get("id");
console.log(idProduct);

/**
 *  GET one specific product's data from API
 * @async function to get one product's data from API using fetch
 * @return { promise } which is parse/translate into JS in the function
 */
async function getOneProduct() {
  const urlOneProduct = `http://localhost:3000/api/products/${idProduct}`;
  const oneProduct = await fetch(urlOneProduct);
  const oneProductParse = await oneProduct.json();
  return oneProductParse;
}

/**
 * Storage data in localStorage for cart
 * @function saveInLocalStorage which save as an array the product in localStorage
 * @param product we want to add
 */
function saveInLocalStorage(productOptions) {
  let productInLocalStorage = JSON.parse(localStorage.getItem("sofa")); // Get the product from the array as an object

  // If array in localStorage is empty = null, create an array and add the productOption in it, as a string
  if (productInLocalStorage === null) {
    productInLocalStorage = [];
    productInLocalStorage.push(productOptions);
    localStorage.setItem("sofa", JSON.stringify(productInLocalStorage));
  } else {
    // Else find in localStorage's array if there is a product with same id & same color as the product we want to add
    let foundProduct = productInLocalStorage.find(
      (p) => p.id == productOptions.id && p.color == productOptions.color
    );
    if (foundProduct === undefined) {
      // If there isn't same id & color at all, add productOptions in localStorage as a string
      productInLocalStorage.push(productOptions);
      localStorage.setItem("sofa", JSON.stringify(productInLocalStorage));
    } else {
      // Else modify only the quantity of the product
      foundProduct.quantity += productOptions.quantity;
      localStorage.setItem("sofa", JSON.stringify(productInLocalStorage));
    }
  }
}

/**
 * @async function to get product's data
 * Display product's data on the page via DOM
 * Add the select product in localStorage using @addEventListener on a button
 */
(async function main() {
  try {
    const oneProduct = await getOneProduct();
    console.log(oneProduct);

    // Insert oneProduct's settings in DOM

    // Creation <img>
    const createImg = document.createElement("img");
    createImg.setAttribute("src", oneProduct.imageUrl);
    createImg.setAttribute("alt", oneProduct.altTxt);
    document.querySelector(".item__img").appendChild(createImg);

    // Creation innerText in <h1>
    document.querySelector("#title").innerText = oneProduct.name;

    // Creation innertext in <span>
    document.querySelector("#price").innerText = oneProduct.price;

    // Creation innerTexte in <p>
    document.querySelector("#description").innerText = oneProduct.description;

    // Creation input's colors choice for each color
    for (let color of oneProduct.colors) {
      const createOption = document.createElement("option");
      createOption.setAttribute("value", color);
      createOption.innerText = `${color}`;
      document.querySelector("#colors").appendChild(createOption);
    }

    // Onclick AddToCart button, add the product sofa in localStorage
    // And reload the page
    document
      .getElementById("addToCart")
      .addEventListener("click", function (event) {
        event.preventDefault();
        let sofa = {
          id: idProduct,
          name: oneProduct.name,
          color: document.getElementById("colors").value,
          quantity: parseInt(document.getElementById("quantity").value),
          altTxt: oneProduct.altTxt,
          urlImg: oneProduct.imageUrl,
        };
        saveInLocalStorage(sofa);
        setTimeout(function () {
          window.location.reload(true);
        }, 1000);
      });
  } catch (err) {
    console.log("hoho error");
  }
})();
