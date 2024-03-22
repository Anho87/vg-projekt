 function fetchAndCreateCards(category) {
    fetch(`https://fakestoreapi.com/products/category/${category}`)
        .then((res) => res.json())
        .then((json) => {
            json.forEach((item) => {
                try {
                    createCard(item, "#clothes");
                } catch (error) {
                    console.error('Error creating card:', error);
                }
            });
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
      fetchAndCreateCards('men\'s clothing');
      fetchAndCreateCards('women\'s clothing');
  }
});

function createCard(product, appendTo) {
  const id = product.id;
  const title = product.title;
  const price = product.price;
  const description = product.description;
  const image = product.image;

  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");
  cardDiv.classList.add("my-2");
  cardDiv.style.width = "18rem";

  const img = document.createElement("img");
  img.classList.add("card-img-top");
  img.src = image;
  img.alt = `image describing ${title}`;
  img.style.height = "300px";

  const cardBodyDiv = document.createElement("div");
  cardBodyDiv.classList.add("card-body");
  cardBodyDiv.classList.add("d-flex");
  cardBodyDiv.classList.add("flex-column");

  const cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = title.slice(0, 50);

  const cardText = document.createElement("p");
  cardText.classList.add("card-text");
  cardText.textContent = description.slice(0, 100) + "...";

  const cardPrice = document.createElement("p");
  cardPrice.classList.add("card-text");
  cardPrice.classList.add("text-warning");  
  cardPrice.textContent = `Price: ${price}$`;

  const btn = document.createElement("a");
  btn.classList.add("btn", "btn-success", "mt-auto");
  btn.id = "addToCartId" + id;
  btn.href = "#";
  btn.textContent = "Add to cart";

  btn.addEventListener("click", () => {
    const cartItems = JSON.parse(window.localStorage.getItem("cartArray")) || [];
    cartItems.push(product);
    window.localStorage.setItem("cartArray", JSON.stringify(cartItems));
    event.preventDefault(); 
  });
  

  cardBodyDiv.appendChild(cardTitle);
  cardBodyDiv.appendChild(cardText);
  cardBodyDiv.appendChild(cardPrice);
  cardBodyDiv.appendChild(btn);

  cardDiv.appendChild(img);
  cardDiv.appendChild(cardBodyDiv);


  const card = document.querySelector(appendTo);
  card.appendChild(cardDiv);
}

function displayOrderedItems() {
  const orderedItems = JSON.parse(localStorage.getItem('cartArray')) || [];
  const orderedItemList = document.getElementById('orderedItemList');
  orderedItemList.innerHTML = '';

  orderedItems.forEach(item => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-condensed');

     
      listItem.innerHTML = `
          <div class="mx-0 px-0">
              <img src="${item.image}" alt="${item.title}" height="50">
          </div>
          <div>
              <h6 class="my-0">${item.title}</h6>
              <small class="text-muted">${item.description}</small>
          </div>
          <span class="text-muted">${item.price}</span>
      `;

      
      orderedItemList.appendChild(listItem);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/checkout.html') {
      displayOrderedItems();
  }
});

function updateCartSize(){
  const cartItems = JSON.parse(window.localStorage.getItem("cartArray")) || [];
  const cartSizeDiv = document.getElementById('cartSize');

  cartSizeDiv.innerHTML = cartItems.length;
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartSize();
    setInterval(updateCartSize, 100);
});

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes("checkout.html")) {
      const emptyCartBtn = document.getElementById('emptyCart');
      emptyCartBtn.addEventListener('click', emptyCart);
  }
});

function emptyCart(){
  window.localStorage.removeItem("cartArray");
  location.reload();
}
