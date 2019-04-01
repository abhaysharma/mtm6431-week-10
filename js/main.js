$(document).ready(function ($) {
  // console.log('IMIN');
  const client = ShopifyBuy.buildClient({
    domain: 'cozy-furnitures.myshopify.com',
    storefrontAccessToken: '0e629a7bb9e2758f8231182f28fd4a31'
  });
  const totalDiv = $('#total');
  const cartDiv = $('#cart');
  client.checkout.create().then((checkout) => {
    console.log(checkout)
    const checkoutId = checkout.id;
    $('#checkoutBtn').attr('href', checkout.webUrl);
    totalDiv.text('Total: ' + checkout.subtotalPrice);
  })

});
