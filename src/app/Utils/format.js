module.exports = {
  // Chuyển số sang định dạng tiền VNĐ
  formatToVND: (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  },
};
