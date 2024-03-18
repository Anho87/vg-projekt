const products = []
fetch('https://fakestoreapi.com/products')
            .then(res=>res.json())
            .then(json=>{
                json.forEach(item => {
                    products.push(item)
                    createCard(item)
                });
            })


function createCard(product){
const id = product.id
const title = product.title
const price = product.price + "$";
//const category = product.category
const description = product.description
const image = product.image


const cardDiv = document.createElement('div');
cardDiv.classList.add('card');
cardDiv.classList.add('my-2');
cardDiv.style.width = '18rem';

const img = document.createElement('img');
img.classList.add('card-img-top');
img.src = image 
img.alt = `image describing ${title}`;

const cardBodyDiv = document.createElement('div');
cardBodyDiv.classList.add('card-body');

const cardTitle = document.createElement('h5');
cardTitle.classList.add('card-title');
cardTitle.textContent = title; 

const cardText = document.createElement('p');
cardText.classList.add('card-text');
cardText.textContent = description; 

const cardPrice = document.createElement('p');
cardPrice.classList.add('card-text');
cardPrice.classList.add('text-warning');
cardPrice.textContent = price; 

const btn = document.createElement('a');
btn.classList.add('btn', 'btn-primary');
btn.href = '#';
btn.textContent = 'Add to cart'; 

cardBodyDiv.appendChild(cardTitle);
cardBodyDiv.appendChild(cardText);
cardBodyDiv.appendChild(cardPrice);
cardBodyDiv.appendChild(btn);

cardDiv.appendChild(img);
cardDiv.appendChild(cardBodyDiv);

const card = document.querySelector("#cards")
card.appendChild(cardDiv);
}

