function fetchAndCreateCards(category) {
    fetch(`https://fakestoreapi.com/products/category/${category}`)
        .then((res) => res.json())
        .then((json) => {
            json.forEach((item) => {
                try {
                    createCard(item);
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
  if (window.location.pathname.includes("index.html")) {
    fetchAndCreateCards('women\'s clothing');
    fetchAndCreateCards('men\'s clothing');
  }
});

function createCard(product) {
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

  try {
    const card = document.querySelector("#clothes");
    card.appendChild(cardDiv);
  } catch (error) {
    
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////





const orderedItems = JSON.parse(window.localStorage.getItem("cartArray")) || [];
let groupedItems = groupItemsByTitle(orderedItems);

function displayOrderedItems() {

  const orderedItemList = document.getElementById('orderedItemList');
    if (orderedItemList) {
        orderedItemList.innerHTML = '';
    }

  groupedItems.forEach(group => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-condensed');

    const quantitySpan = document.createElement('span');
    quantitySpan.textContent = `Qty: ${group.quantity}`;

    listItem.innerHTML = `
      <div class="mx-0 px-0">
          <img src="${group.items[0].image}" alt="${group.items[0].title}" height="50">
      </div>
      <div>
          <h6 class="my-0">${group.items[0].title}</h6>
          <small class="text-muted">${group.items[0].description.slice(0,150)+ "..."}</small>
      </div>
      <span class="text-muted">${group.items[0].price * group.quantity}</span>
      `;

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('d-flex', 'flex-column');

    const plusButton = document.createElement('button');
    plusButton.textContent = '+';
    plusButton.classList.add('btn', 'btn-success');
    plusButton.addEventListener('click', () => increaseQuantity(group));

    const minusButton = document.createElement('button');
    minusButton.textContent = '-';
    minusButton.classList.add('btn', 'btn-danger');
    minusButton.addEventListener('click', () => decreaseQuantity(group));

    buttonsDiv.appendChild(plusButton);
    buttonsDiv.appendChild(minusButton);

    listItem.appendChild(quantitySpan);
    listItem.appendChild(buttonsDiv);

    orderedItemList.appendChild(listItem);
  });
}

function groupItemsByTitle(items) {
  const groupedItems = [];
  items.forEach(item => {
    const existingGroup = groupedItems.find(group => group.items[0].title === item.title);
    if (existingGroup) {
      existingGroup.quantity++; 
    } else {
      groupedItems.push({ items: [item], quantity: 1 }); 
    }
  });
  console.log('Grouped Items:', groupedItems);
  return groupedItems;
}

function increaseQuantity(group) {
  group.quantity++;
  updateLocalStorage(group.items[0].title, 'add');
  displayOrderedItems(); 
}

function decreaseQuantity(group) {
    group.quantity--;
    if (group.quantity === 0) {
      const indexToRemove = groupedItems.findIndex(g => g.items[0].title === group.items[0].title);
      if (indexToRemove !== -1) {
        groupedItems.splice(indexToRemove, 1);
      }
    }
    updateLocalStorage(group.items[0].title,'remove');
    displayOrderedItems();
}

function updateLocalStorage(title, change) {
  let cartItems = JSON.parse(window.localStorage.getItem("cartArray")) || [];
  const indexToChange = cartItems.findIndex(item => item.title === title);
  if(change == 'remove'){
    if (indexToChange !== -1) {
      cartItems.splice(indexToChange, 1);
      window.localStorage.setItem("cartArray", JSON.stringify(cartItems));
    } else {
      console.log("Item with the specified title not found in the cart.");
    }
  }else if(change == 'add'){
    const existingItem = cartItems.find(item => item.title === title);
        if (existingItem) {
      cartItems.push(existingItem);
      window.localStorage.setItem("cartArray", JSON.stringify(cartItems));
    } else {
      console.log("Item with the specified title not found.");
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  displayOrderedItems();
});




////////////////////////////////////////////////////////////////////////////////////////

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

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes("checkout.html")) {
      const totalPriceDiv = document.getElementById('totalPrice');
      let totalPriceOfItems = 0;
      if (orderedItems) {
          orderedItems.forEach(item => {
              totalPriceOfItems += item.price;
          });
          totalPriceDiv.innerHTML = totalPriceOfItems.toFixed(2); 
      } 
  }
});