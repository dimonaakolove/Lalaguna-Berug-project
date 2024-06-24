document.addEventListener("DOMContentLoaded", () => {
  // Load CSS dynamically
  const cssId = "myCss";
  if (!document.getElementById(cssId)) {
    const head = document.head;
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "css/styles.css";
    link.media = "all";
    head.appendChild(link);
  }

  //product container
  const productContainer = document.createElement("div");
  productContainer.id = "product-list";

  const products = [
    { category: "Leather Bag", id: 1, name: "Marille Turkish-Maroon Leather Bag", price: 60, image: "images/Leather-Bag (1).jpg", description: "A High-quality leather bag good for heavy stuff like officeworks." },
    { category: "Leather Bag", id: 2, name: "Marille Off-dessert Leather Bag", price: 46, image: "images/Leather-Bag2 (1).jpg", description: "A nice touch of soft, leather-field like bag." },
    { category: "Leather Bag", id: 3, name: "Marille Shred Leather Bag", price: 62, image: "images/Leather-Bag3 (1).jpg", description: "A pinch of aesthetics and that match your dress code." },
    { category: "Canvas Bag", id: 4, name: "Marille Peach-White Canvas Bag", price: 25, image: "images/Canvas-Bag(1).jpg", description: "Simple, Girly peach vibes bag" },
    { category: "Canvas Bag", id: 5, name: "Marille Camo-Tucked Canvas Bag", price: 25, image: "images/Canvas-Bag2 (1).jpg", description: "A Durable canvas bag" },
    { category: "Canvas Bag", id: 6, name: "Marille Dyed-Leather Canvas Bag", price: 28, image: "images/Canvas-Bag3 (1).jpg", description: "Durable, Stylish, Great canvas bag" },
    { category: "Back Pack", id: 7, name: "Marille Apricot Backpack", price: 42, image: "images/BackPack(1).jpg", description: "Stylish, Camp Back Pack" },
    { category: "Back Pack", id: 8, name: "Marille Apricot Spring Backpack For Girls", price: 30, image: "images/BackPack2 (1).jpg", description: "Stylish Back Pack" },
    { category: "Back Pack", id: 9, name: "Marille Grayed-Starred Backpack", price: 27, image: "images/BackPack3.jpg", description: "Stylish Back Pack" },
    { category: "Back Pack", id: 10, name: "Marille Camp-Brown Backpack", price: 63, image: "images/BackPack4 (1).jpg", description: "Stylish, Camp Back Pack that good for travelling" },
   
  ];

  const categories = [...new Set(products.map(product => product.category))];

  categories.forEach(category => {
    const categoryHeader = document.createElement("h2");
    categoryHeader.textContent = category;
    categoryHeader.style.marginTop = "20px";
    productContainer.appendChild(categoryHeader);

    products.filter(product => product.category === category).forEach(product => {
      const productElement = document.createElement("div");
      productElement.classList.add("product-item");
      productElement.innerHTML = `
        <div class="product-list">
          <a href="viewdetails.html?id=${encodeURIComponent(product.id)}" class="btn-hover"><img src="${product.image}" alt="${product.name}"></a>
          <h3>${product.name}</h3>
        </div>
      `;
      productContainer.appendChild(productElement);
    });
  });

  // Append productContainer to the product-list-container div
  const productListContainer = document.getElementById("product-list-container");
  if (productListContainer) {
    productListContainer.appendChild(productContainer);
  } else {
    console.error("Product list container not found");
  }

  function showProductDetails(productId) {
    if (!productId) {
      console.error("Product ID is required");
      return;
    }

    const product = products.find(p => p.id == productId);
    if (!product) {
      console.error(`Product with ID ${productId} not found`);
      return;
    }

    const productDetailsContainer = document.getElementById("product-details");
    if (!productDetailsContainer) {
      console.error("Product details container not found");
      return;
    }

    productDetailsContainer.innerHTML = `
      <div class="product-details-container">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <p>$${product.price}</p>
          <button onclick="buyNow(${product.id})" class="button">Buy Now</button>
          <div class="product-icons">
            <a href="wishlist.html"><img src="images/wishlist.png" alt="Wishlist Icon" onclick="addToWishlist(${product.id})"></a>
            <a href="cart.html"><img src="images/shopping-cart.png" alt="Cart Icon" onclick="addToCart(${product.id})"></a>
          </div>
        </div>
      </div>
    `;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  if (productId) {
    showProductDetails(productId);
  }

  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  let wishlistItems = JSON.parse(localStorage.getItem("wishlistItems")) || [];

  updateCart();
  updateWishlist();

  window.addToCart = function (id) {
    const product = products.find(p => p.id == id);
    cartItems.push(product);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCart();
  };

  window.addToWishlist = function (id) {
    const product = products.find(p => p.id == id);
    if (!wishlistItems.some(item => item.id === id)) {
      wishlistItems.push(product);
      localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
      updateWishlist();
    }
  };

  window.buyNow = function (id) {
    addToCart(id);
    window.location.href = "cart.html";
  };

  window.removeFromCart = function (id) {
    cartItems = cartItems.filter(item => item.id !== id);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCart();
  };

  window.removeFromWishlist = function (id) {
    wishlistItems = wishlistItems.filter(item => item.id !== id);
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    updateWishlist();
  };

  // Function to update cart
  function updateCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalContainer = document.getElementById("cart-total");

    if (cartItemsContainer && cartTotalContainer) {
      cartItemsContainer.innerHTML = "";
      let total = 0;

      if (cartItems.length > 0) {
        cartItems.forEach(item => {
          const cartItemElement = document.createElement("div");
          cartItemElement.classList.add("cart-item");
          cartItemElement.innerHTML = `
            <div class="cart-item-image">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
              <p>${item.name}</p>
              <p>$${item.price}</p>
              <button onclick="removeFromCart(${item.id})" class="button">Remove</button>
            </div>
          `;

          cartItemsContainer.appendChild(cartItemElement);
          total += item.price;
        });

        cartTotalContainer.innerHTML = `Total: $${total.toFixed(2)}`;
      } else {
        cartTotalContainer.innerHTML = `Total: $0.00`;
      }
    }
  }

  // Function to update wishlist
  function updateWishlist() {
    const wishlistItemsContainer = document.getElementById("wishlist-items");

    if (wishlistItemsContainer) {
      wishlistItemsContainer.innerHTML = "";

      if (wishlistItems.length > 0) {
        wishlistItems.forEach(item => {
          const wishlistItemElement = document.createElement("div");
          wishlistItemElement.classList.add("wishlist-item");
          wishlistItemElement.innerHTML = `
            <div class="wishlist-item-image">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="wishlist-item-info">
              <p>${item.name}</p>
              <p>$${item.price}</p>
              <button onclick="removeFromWishlist(${item.id})" class="button">Remove</button>
            </div>
          `;

          wishlistItemsContainer.appendChild(wishlistItemElement);
        });
      }
    }
  }

  // Function to checkout
  window.checkout = function () {
    if (cartItems.length > 0) {
      cartItems = [];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      window.location.href = "confirmation.html";
    } else {
      alert("Your cart is empty.");
    }
  };

  // Slider functionality
  let slideIndex = 0;
  const slides = document.querySelector(".slides");

  function showSlide(n) {
    const totalSlides = document.querySelectorAll(".slide").length;
    slideIndex = (n + totalSlides) % totalSlides;
    slides.style.transform = `translateX(${-slideIndex * 100}%)`;
  }

  window.moveSlide = function (n) {
    showSlide(slideIndex + n);
  };

  showSlide(slideIndex);
  setInterval(() => moveSlide(1), 5000);
});
