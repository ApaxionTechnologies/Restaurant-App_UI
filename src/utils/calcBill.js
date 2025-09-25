export const calculateBill = (cartItems) => {
  let subtotal = 0;
  let totalDiscount = 0;
  let totalGst = 0;

  const items = cartItems.map((item) => {
    const qty = item.qty || 1;
    const price = parseFloat(item.price) || 0;

    const itemTotal = price * qty;

    const discountAmount = item.discount
      ? (itemTotal * parseFloat(item.discount)) / 100
      : 0;

    const taxableAmount = itemTotal - discountAmount;

    const gstRate =
      item.gstRate !== undefined
        ? parseFloat(item.gstRate)
        : item.type === "veg"
        ? 5 // Veg items GST default
        : 12; // Non-Veg GST default

    const gstAmount = (taxableAmount * gstRate) / 100;

    subtotal += itemTotal;
    totalDiscount += discountAmount;
    totalGst += gstAmount;

    return {
      ...item,
      itemTotal: itemTotal.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      taxableAmount: taxableAmount.toFixed(2),
      gstRate,
      gstAmount: gstAmount.toFixed(2),
      totalItemPrice: (taxableAmount + gstAmount).toFixed(2),
    };
  });

  const sgst = totalGst / 2;
  const cgst = totalGst / 2;
  const total = subtotal - totalDiscount + totalGst;

  return {
    items,
    subtotal,
    totalDiscount,
    totalGst,
    sgst,
    cgst,
    total,
  };
};
