$(document).ready(function ($) {
  // console.log('IMIN');
  const client = ShopifyBuy.buildClient({
    domain: 'cozy-furnitures.myshopify.com',
    storefrontAccessToken: '0e629a7bb9e2758f8231182f28fd4a31'
  });
  const totalDiv = $('#total');
  const cartDiv = $('#cart');
  client.checkout.create().then((checkout) => {
    // console.log(checkout)
    const checkoutId = checkout.id;
    $('#checkoutBtn').attr('href', checkout.webUrl);
    totalDiv.text('Total: ' + checkout.subtotalPrice);

    client.product.fetchAll().then((products) => {
      // console.log(products)
      $.each(products, function (key, product) {
        let title = product.title;
        let description = product.description;
        let image = product.images[0].src;
        let productVarId = product.variants[0].id;
        let prod = `<div class="col-sm-6 mb-4"><div class="card">
                    <img src="${image}" class="card-img-top" alt="${title}">
                    <div class="card-body">
                      <h5 class="card-title">${title}</h5>
                      <p class="card-text">${description}</p>
                      <button class="addCart btn btn-primary" data-prodid="${productVarId}">
                        Add to Cart
                      </button>
                    </div>
                  </div></div>`;
        $("#products").append(prod);
      }); // closing the products loop
    }); // closing the fetchAll products
    $('#products').on('click', '.addCart', function (e) {
      let prodId = $(this).attr('data-prodid');
      const lineItemsToAdd = [
        {
          variantId: prodId,
          quantity: 1
        }
      ];
      client.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
        updateCart(checkout);
      }); // Closing add line items to cart
    }); // Closing Add Cart button click
    $("#cart").on('click', '.delProd', function (e) {
      // e.preventDefault();
      let itemToRemove = $(this).attr('data-lineItemId');
      const lineItemIdsToRemove = [
        itemToRemove
      ];
      client.checkout.removeLineItems(checkoutId, lineItemIdsToRemove)
        .then((checkout) => {
          updateCart(checkout);
        }); // Closing remove line items from checkout
    }); // Closing on click delete products
  }); // creating the checkout object
  function updateCart (checkout) {
    totalDiv.text('Total: ' + checkout.subtotalPrice);
    let cartItems = checkout.lineItems;
    if (cartItems.length !== 0) {
      let productList = '<ul class="list-group list-group-flush">';
      cartItems.forEach(function (item) {
        productList += `<li class="list-group-item">
        ${item.title} x ${item.quantity}
        <a href="javascript:void(0)" class="delProd text-danger"
        data-lineItemId="${item.id}">Delete</a>
        </li>`;
      }); // Closing the line items loop
      productList += '</ul>';
      cartDiv.html(productList);
    } else {
      cartDiv.html('Your cart is empty');
    }
  }
}); // Closing the document ready function
