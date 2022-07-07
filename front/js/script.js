/* GET data products from API */
async function getProducts() {
  const urlProducts = `http://localhost:3000/api/products/`;
  const products = await fetch(urlProducts);
  const productParse = await products.json();
  return productParse;
}

(async function main() {
  try {
    const products = await getProducts();
    console.log(products);

    // creation card applying each product of products array

    for (let product of products) {
      // creation <a>

      const createA = document.createElement("a");
      createA.setAttribute("href", `./product.html?id=${product._id}`);
      createA.setAttribute("class", "linkProductPage");
      document.getElementById("items").appendChild(createA);

      // creation <article>
      const createArticle = document.createElement("article");
      createA.appendChild(createArticle);

      // creation <img>
      const createImg = document.createElement("img");
      createImg.setAttribute("src", product.imageUrl);
      createImg.setAttribute("alt", product.altTxt);
      createArticle.appendChild(createImg);

      // creation <h3>
      const createH3 = document.createElement("h3");
      createH3.setAttribute("class", "productName");
      createH3.innerText = product.name;
      createArticle.appendChild(createH3);

      // creation <p>
      const createP = document.createElement("p");
      createP.setAttribute("class", "productDescription");
      createP.innerText = product.description;
      createArticle.appendChild(createP);
    }
  } catch (err) {
    console.log(err);
  }
})();
