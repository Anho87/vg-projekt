function fetchAndCreateCards(category) {
  fetch(`https://fakestoreapi.com/products/category/${category}`)
    .then((res) => res.json())
    .then((json) => {
      json.forEach((item) => {
        try {
          createCard(item);
        } catch (error) {
          console.error("Error creating card:", error);
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("index.html")) {
    fetchAndCreateCards("women's clothing");
    fetchAndCreateCards("men's clothing");
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
    const cartItems =
      JSON.parse(window.localStorage.getItem("cartArray")) || [];
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
  } catch (error) {}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

const orderedItems = JSON.parse(window.localStorage.getItem("cartArray")) || [];
let groupedItems = groupItemsByTitle(orderedItems);

function displayOrderedItems() {
  const orderedItemList = document.getElementById("orderedItemList");
  if (orderedItemList) {
    orderedItemList.innerHTML = "";
  }

  groupedItems.forEach((group) => {
    const listItem = document.createElement("li");
    listItem.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "lh-condensed"
    );

    const quantitySpan = document.createElement("span");
    quantitySpan.textContent = `Qty: ${group.quantity}`;

    listItem.innerHTML = `
    <div class="item-container">
    <div class="item-details">
      <div class="image-container">
        <img src="${group.items[0].image}" alt="${
      group.items[0].title
    }" height="50">
      </div>
      <div class="description-container">
        <h6 class="item-title">${group.items[0].title}</h6>
        <p class="item-description">${group.items[0].description}</p>
      </div>
    </div>
    <div class="item-info">
    <span class="price">$${(group.items[0].price * group.quantity).toFixed(
      2
    )}</span>
      <span class="quantity">Qty: ${group.quantity}</span>
    </div>
  </div>
  
    `;

    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("row", "d-flex", "flex-column", "align-items-end");

    const plusButton = document.createElement("button");
    plusButton.textContent = "+";
    plusButton.classList.add("btn", "btn-success");
    plusButton.addEventListener("click", () => increaseQuantity(group));

    const minusButton = document.createElement("button");
    minusButton.textContent = "-";
    minusButton.classList.add("btn", "btn-warning");
    minusButton.addEventListener("click", () => decreaseQuantity(group));

    const removeEachButton = document.createElement("button");
    removeEachButton.textContent = "X";
    removeEachButton.classList.add("btn", "btn-danger");
    removeEachButton.addEventListener("click", () => removeEach(group));

    buttonsDiv.appendChild(plusButton);
    buttonsDiv.appendChild(minusButton);
    buttonsDiv.appendChild(removeEachButton);

    listItem.appendChild(buttonsDiv);

    updateTotalPrice();

    if (orderedItemList) {
      orderedItemList.appendChild(listItem);
    }
  });
}

function groupItemsByTitle(items) {
  const groupedItems = [];
  items.forEach((item) => {
    const existingGroup = groupedItems.find(
      (group) => group.items[0].title === item.title
    );
    if (existingGroup) {
      existingGroup.quantity++;
    } else {
      groupedItems.push({ items: [item], quantity: 1 });
    }
  });
  return groupedItems;
}

function removeEach(group) {
  group.quantity == 0;
  updateLocalStorage(group.items[0].title, "removeAll");
  displayOrderedItems();
  updateTotalPrice();
}

function increaseQuantity(group) {
  group.quantity++;
  updateLocalStorage(group.items[0].title, "add");
  displayOrderedItems();
  updateTotalPrice();
}

function decreaseQuantity(group) {
  group.quantity--;
  if (group.quantity === 0) {
    const indexToRemove = groupedItems.findIndex(
      (g) => g.items[0].title === group.items[0].title
    );
    if (indexToRemove !== -1) {
      groupedItems.splice(indexToRemove, 1);
    }
  }
  updateLocalStorage(group.items[0].title, "remove");
  displayOrderedItems();
  updateTotalPrice();
}

function updateTotalPrice() {
  const orderedItems =
    JSON.parse(window.localStorage.getItem("cartArray")) || [];
  const totalPriceDiv = document.getElementById("totalPrice");
  let totalPriceOfItems = 0;
  if (orderedItems) {
    orderedItems.forEach((item) => {
      totalPriceOfItems += item.price;
    });
    totalPriceDiv.innerHTML = "$" + totalPriceOfItems.toFixed(2);
  }
}

function updateLocalStorage(title, change) {
  let cartItems = JSON.parse(window.localStorage.getItem("cartArray")) || [];
  const indexToChange = cartItems.findIndex((item) => item.title === title);
  if (change == "remove") {
    if (indexToChange !== -1) {
      cartItems.splice(indexToChange, 1);
      window.localStorage.setItem("cartArray", JSON.stringify(cartItems));
    } else {
      console.log("Item with the specified title not found in the cart.");
    }
  } else if (change == "add") {
    const existingItem = cartItems.find((item) => item.title === title);
    if (existingItem) {
      cartItems.push(existingItem);
      window.localStorage.setItem("cartArray", JSON.stringify(cartItems));
    } else {
      console.log("Item with the specified title not found.");
    }
  } else if (change == "removeAll") {
    cartItems = cartItems.filter((item) => item.title !== title);
    window.localStorage.setItem("cartArray", JSON.stringify(cartItems));
    location.reload();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  displayOrderedItems();
});

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("checkout.html")) {
    const emptyCartBtn = document.getElementById("emptyCart");
    emptyCartBtn.addEventListener("click", emptyCart);
  }
});

function emptyCart() {
  window.localStorage.removeItem("cartArray");
  location.reload();
}

////////////////////////////////////////////////////////////////////////////////////////

function updateCartSize() {
  const cartItems = JSON.parse(window.localStorage.getItem("cartArray")) || [];
  const cartSizeDiv = document.getElementById("cartSize");
  cartSizeDiv.innerHTML = cartItems.length;
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartSize();
  setInterval(updateCartSize, 100);
});

/////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.addEventListener("click", function (event) {
    event.preventDefault();

    removeAlerts();

    const inputName = document.getElementById("inputName").value.trim();
    const inputEmail = document.getElementById("inputEmail").value.trim();
    const inputPhone = document.getElementById("inputPhone").value.trim();
    const inputAddress = document.getElementById("inputAddress").value.trim();
    const inputCity = document.getElementById("inputCity").value.trim();
    const inputZip = document.getElementById("inputZip").value.trim();
    let isValid = true;

    const onlyLettersRegex = /^[A-Za-z\s]{2,50}$/;
    const containsAtRegex = /@/;
    const phoneRegex = /^[0-9\d\s()-]{1,50}$/;
    const onlyNumbersRegex = /[0-9]/;

    // if (!onlyLettersRegex.test(inputName)) {
    //     displayAlert("Name must be between 2 and 50 characters long and contain only letters.", document.getElementById('inputName'));
    //     isValid = false;
    // }

    // if (inputEmail.length > 50 || !containsAtRegex.test(inputEmail)) {
    //   displayAlert('E-postadressen får inte vara längre än 50 tecken och måste innehålla @.', document.getElementById('inputEmail'));
    //   isValid = false;
    // }

    // if (!phoneRegex.test(inputPhone)) {
    //     displayAlert('Numret får endast innehålla siffror, paranteser, bindestreck och max 50 tecken långt.', document.getElementById('inputPhone'));
    //     isValid = false;
    //   }

    // if (inputAddress.length < 2 || inputAddress.length > 50) {
    //   displayAlert('Addressen får endast vara minst 2 tecken och max 50 tecken.', document.getElementById('inputAddress'));
    //   isValid = false;
    // }

    // if (!onlyLettersRegex.test(inputCity)) {
    //   displayAlert('Staden får endast innehålla 2-50 tecken.', document.getElementById('inputCity'))
    //   isValid = false;
    // }

    // if (!inputZip.length === 5 || !onlyNumbersRegex.test(inputZip)) {
    //   displayAlert('Postkoden får endast vara 5 siffror', document.getElementById('inputZip'));
    //   isValid = false;
    // }

    if (isValid) {
      window.location.href = "purchaseConfirmationPage.html";
    }
  });
});

function displayAlert(message, inputField) {
  const alertDiv = document.createElement("div");
  alertDiv.classList.add("alert", "alert-danger");
  alertDiv.setAttribute("role", "alert");
  alertDiv.textContent = message;

  inputField.parentNode.insertBefore(alertDiv, inputField.nextSibling);
}

function removeAlerts() {
  const alerts = document.querySelectorAll(".alert-danger");
  alerts.forEach((alert) => alert.remove());
}
