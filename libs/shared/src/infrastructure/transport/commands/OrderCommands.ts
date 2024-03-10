class OrderCommands {
  static GET_ORDERS = {
    cmd: 'get-orders',
  };
  static GET_ORDER_BY_ID = {
    cmd: 'get-order-by-id',
  };
  static CHECKOUT = {
    cmd: 'checkout',
  };
  static ADD_PRODUCT_TO_ORDER = {
    cmd: 'add-product-to-order',
  };

  static UPDATE_ON_CHECKOUT_COMPLETE = {
    cmd: 'update-on-checkout-complete',
  };
  static UPDATE_ON_CHECKOUT_EXPIRED = {
    cmd: 'update-on-checkout-expired',
  };
}

export default OrderCommands;
