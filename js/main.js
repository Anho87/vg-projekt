///////////////////////////////////////////////////////////////
///////////////// Fetch Data /////////////////////////////////
///////////////////////////////////////////////////////////////

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
  try {
    const { id, title, price, image } = product;

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card", "my-2");
    cardDiv.style.width = "18rem";

    const imgLink = document.createElement("a");
    imgLink.href = "product.html";
    imgLink.addEventListener("click", () => {
      window.localStorage.setItem("product", JSON.stringify(product));
    });

    const img = document.createElement("img");
    img.classList.add("card-img-top");
    img.src = image;
    img.alt = `image describing ${title}`;
    img.style.height = "300px";

    imgLink.appendChild(img);

    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.classList.add("card-body", "d-flex", "flex-column");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = title.slice(0, 50);

    const cardPrice = document.createElement("p");
    cardPrice.classList.add("card-text", "price");
    cardPrice.textContent = `Price: ${price}$`;

    const btn = document.createElement("button");
    btn.classList.add("btn", "btn-success", "mt-auto");
    btn.id = "addToCartId" + id;
    btn.textContent = "Add to cart";
    btn.addEventListener("click", () => {
      const cartItems = JSON.parse(window.localStorage.getItem("cartArray")) || [];
      const productNameWithoutQuotes = product.title.replace(/'/g, '');
      cartItems.push({ ...product, title: productNameWithoutQuotes });
      window.localStorage.setItem("cartArray", JSON.stringify(cartItems));
      event.preventDefault();
    });

    cardBodyDiv.appendChild(cardTitle);
    cardBodyDiv.appendChild(cardPrice);
    cardBodyDiv.appendChild(btn);
    cardDiv.appendChild(imgLink);
    cardDiv.appendChild(cardBodyDiv);

    const productsContainer = document.querySelector('#products');
    productsContainer.appendChild(cardDiv);
  } catch (error) {
    console.error("Error creating card:", error);
  }
} 



///////////////////////////////////////////////////////////////
///////////////// Cart Button /////////////////////////////////
///////////////////////////////////////////////////////////////

function updateCartSize() {
  const cartItems = JSON.parse(window.localStorage.getItem("cartArray")) || [];
  const cartSizeDiv = document.getElementById("cartSize");
  if (cartSizeDiv) {
      cartSizeDiv.innerHTML = cartItems.length;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartSize();
  setInterval(updateCartSize, 100);
});

///////////////////////////////////////////////////////////////
///////////////// Checkout Items //////////////////////////////
///////////////////////////////////////////////////////////////

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
                <a href="product.html" onclick="imageClickHandler('${group.items[0].title}')">
                    <img src="${group.items[0].image}" alt="${group.items[0].title}" height="50">
                </a>
            </div>
            <div class="description-container">
                <h6 class="item-title">${group.items[0].title}</h6> 
                <p class="item-description">${group.items[0].description}</p> 
            </div>
        </div>
        <div class="item-info">
            <span class="price">$${(group.items[0].price * group.quantity).toFixed(2)}</span>
            <span class="quantity">Qty: ${group.quantity}</span>
        </div>
    </div>
`;

    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("buttons-container", "d-flex", "align-items-center");

    const plusButton = document.createElement("button");
    plusButton.textContent = "+";
    plusButton.classList.add("btn", "btn-success", "mr-2");
    plusButton.addEventListener("click", () => increaseQuantity(group));

    const minusButton = document.createElement("button");
    minusButton.textContent = "-";
    minusButton.classList.add("btn", "btn-warning", "mr-2");
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
}

function increaseQuantity(group) {
  group.quantity++;
  updateLocalStorage(group.items[0].title, "add");
  displayOrderedItems();
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
}

function updateTotalPrice() {
  const orderedItems = JSON.parse(window.localStorage.getItem("cartArray")) || [];
  const totalPriceElements = document.querySelectorAll(".totalPrice");
  let totalPriceOfItems = 0;
  
  if (orderedItems) {
    orderedItems.forEach((item) => {
      totalPriceOfItems += item.price;
    });
    
    totalPriceElements.forEach((element) => {
      element.innerHTML = "$" + totalPriceOfItems.toFixed(2);
    });
  }
}

function updateLocalStorage(title, change) {
  let cartItems = JSON.parse(window.localStorage.getItem("cartArray")) || [];
  if (change == "remove") {
    const indexToChange = cartItems.findIndex((item) => item.title === title);
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

function findProductByTitle(title) {
  var cartArray = JSON.parse(localStorage.getItem('cartArray'));
  for (var i = 0; i < cartArray.length; i++) {
    if (cartArray[i].title.toLowerCase().trim() === title.toLowerCase().trim()) {
      return cartArray[i];
    }
  }
  return null; 
}

function imageClickHandler(title) {
  var product = findProductByTitle(title);
  console.log(product);

  if (product) {
      window.localStorage.setItem("product", JSON.stringify(product));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("checkout.html")) {
    displayOrderedItems();
    const emptyCartBtn = document.getElementById("emptyCart");
    emptyCartBtn.addEventListener("click", emptyCart);
  }
});

function emptyCart() {
  window.localStorage.removeItem("cartArray");
  location.reload();
}

///////////////////////////////////////////////////////////////
///////////////// Checkout person info ////////////////////////
///////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("checkout.html")) {
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

    const formData = {
      name: inputName,
      email: inputEmail,
      phone: inputPhone,
      address: inputAddress,
      city: inputCity,
      zip: inputZip
    };
    const formDataString = JSON.stringify(formData);
    localStorage.setItem("formData", formDataString);

    let isValid = true;

    const onlyLettersRegex = /^[A-Za-z\s]{2,50}$/;
    const containsAtRegex = /@/;
    const phoneRegex = /^[0-9\d\s()-]{1,50}$/;
    const onlyNumbersRegex = /[0-9]/;

    if (!onlyLettersRegex.test(inputName)) {
        displayAlert("Name must be between 2 and 50 characters long and contain only letters.", document.getElementById('inputName'));
        isValid = false;
    }

    if (inputEmail.length > 50 || !containsAtRegex.test(inputEmail)) {
      displayAlert('The email address cannot be longer than 50 characters and must contain @.', document.getElementById('inputEmail'));
      isValid = false;
    }

    if (!phoneRegex.test(inputPhone)) {
        displayAlert('The number can only contain digits, parentheses, hyphens, and be up to 50 characters long.', document.getElementById('inputPhone'));
        isValid = false;
      }

    if (inputAddress.length < 2 || inputAddress.length > 50) {
      displayAlert('The address must be between 2 and 50 characters long.', document.getElementById('inputAddress'));
      isValid = false;
    }

    if (!onlyLettersRegex.test(inputCity)) {
      displayAlert('The cityname must be between 2 and 50 characters long.', document.getElementById('inputCity'))
      isValid = false;
    }

    if (!inputZip.length === 5 || !onlyNumbersRegex.test(inputZip)) {
      displayAlert('The postal code can only be 5 digits.', document.getElementById('inputZip'));
      isValid = false;
    }

    if (isValid) {
      window.location.href = "purchaseConfirmationPage.html";
    }
  });
}});

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



///////////////////////////////////////////////////////////////
///////////////// Purchase confirmation ///////////////////////
///////////////////////////////////////////////////////////////


function displayBoughtItems() {
  const boughtItemList = document.getElementById("boughtItemList");
  if (boughtItemList) {
    boughtItemList.innerHTML = "";
  }

  const tableWrapper = document.createElement("div");
  tableWrapper.classList.add("table-responsive"); 

  const table = document.createElement("table");
  table.classList.add("table", "table-striped");

  const tableHeader = document.createElement("thead");
  tableHeader.innerHTML = `
    <tr>
      <th></th>
      <th></th>
      <th></th>
      <th id="priceHeader">Price</th>
      <th id="amountHeader">Amount</th>
    </tr>
  `;
  table.appendChild(tableHeader);

  const tableBody = document.createElement("tbody");

  groupedItems.forEach((group) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><img src="${group.items[0].image}" alt="${group.items[0].title}" height="50"></td>
      <td id="tableTitle">${group.items[0].title}</td>
      <td id="tableDescription">${group.items[0].description}</td>
      <td class="price">$${(group.items[0].price * group.quantity).toFixed(2)}</td>
      <td>${group.quantity}</td>
    `;

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);

  tableWrapper.appendChild(table);

  if (boughtItemList) {
    boughtItemList.appendChild(tableWrapper); 
  }

  updateTotalPrice();
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("purchaseConfirmationPage.html")) {
  displayBoughtItems();
  addUserInfo();
  }
});

function addUserInfo() {
  const formDataString = localStorage.getItem("formData");
  
  if (formDataString) {
  const formData = JSON.parse(formDataString);

  const userName = formData.name;
  const userEmail = formData.email;
  const userPhone = formData.phone;
  const userAddress = formData.address;
  const userCity = formData.city;
  const userZipCode = formData.zip;

  document.getElementById("userName").textContent = userName || '';
  document.getElementById("userEmail").textContent = userEmail || '';
  document.getElementById("userPhone").textContent = userPhone || '';
  document.getElementById("userAddress").textContent = userAddress || '';
  document.getElementById("userCity").textContent = userCity || '';
  document.getElementById("userZipCode").textContent = userZipCode || '';
  

  window.localStorage.clear();
  
} else {
  console.log("No form data found in localStorage.");
}
}

///////////////////////////////////////////////////////////////
///////////////// Product Page ////////////////////////////////
///////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("product.html")) {
    const product = JSON.parse(window.localStorage.getItem("product")) || [];
    console.log(product);
    const image = product.image;
    const title = product.title;
    const price = product.price;
    const description = product.description;
    const rate = product.rating.rate;
    const count = product.rating.count;

    document.getElementById("productImage").src = image;
    document.getElementById("productTitle").textContent = title;
    document.getElementById("productPrice").textContent = `Price: ${price}$`;
    document.getElementById("productDescription").textContent = description;
    document.getElementById("rateCount").textContent = `${rate}/5 - ${count} votes`;

    document.getElementById("addToCartButton").addEventListener("click", () => {
      const quantity = document.getElementById("inputQuantity").value;
      const cartItems = JSON.parse(window.localStorage.getItem("cartArray")) || [];
      if (quantity > 0) {
        for (let index = 0; index < quantity; index++) {
          cartItems.push(product);
          window.localStorage.setItem("cartArray", JSON.stringify(cartItems));
          } 
      }
    });
  }
});

///////////////////////////////////////////////////////////////
///////////////// Login Page/Sign-up Page /////////////////////
///////////////////////////////////////////////////////////////

function redirectToLogin() {
  window.location.href = "login.html";
}

function redirectToSignUp(){
  window.location.href = "sign-up.html";
}


///////////////////////////////////////////////////////////////
///////////////// Contact Us /////////////////////////////////
///////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("contact-us.html")) {
    const submitBtn = document.getElementById("contactSubmitBtn");
    submitBtn.addEventListener("click", function(event) {
      event.preventDefault(); 
      emptyTextFields();
      const displayAlert = `
        <div class="alert alert-success" role="alert">
            Thank you! We will get back to you as soon as possible!
        </div>
      `;
      document.getElementById('displaySuccesAlert').innerHTML = displayAlert;
    });
  }
});


function emptyTextFields() {
  var formControls = document.getElementsByClassName('form-control');
  for (var i = 0; i < formControls.length; i++) {
      formControls[i].value = '';
  }
}

///////////////////////////////////////////////////////////////
///////////////// Header Footer ///////////////////////////////
///////////////////////////////////////////////////////////////

fetch('footer.html')
      .then(response => response.text())
      .then(html => {
        document.getElementById('footer-placeholder').innerHTML = html;
      });


fetch('header.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('header-placeholder').innerHTML = html;
});