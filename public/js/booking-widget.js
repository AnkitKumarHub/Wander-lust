// booking-widget.js

document.addEventListener("DOMContentLoaded", () => {
  // Get the dynamic pricePerNight from the data attribute
 
  const pricePerNightString =
    document.getElementById("booking-data").dataset.pricePerNight;
  const pricePerNight = parseFloat(pricePerNightString.replace(/,/g, "")); // Remove commas  parseFloat stops parsing once it encounters a non-numeric character.
  const serviceFee = 150;

  const checkin = flatpickr("#checkin", {
    dateFormat: "Y-m-d",
    minDate: "today",
    onChange: function (selectedDates, dateStr) {
      checkout.set("minDate", dateStr);
      calculateTotal();
    },
  });

  const checkout = flatpickr("#checkout", {
    dateFormat: "Y-m-d",
    minDate: "today",
    onChange: calculateTotal,
  });

  function calculateTotal() {
    const checkinDate = new Date(document.getElementById("checkin").value);
    const checkoutDate = new Date(document.getElementById("checkout").value);

    if (checkinDate && checkoutDate && checkoutDate > checkinDate) {
      const numOfNights = (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24);
      const subtotal = numOfNights * pricePerNight;
      const total = subtotal + serviceFee;

      document.getElementById("num-nights").textContent = numOfNights;
      document.getElementById(
        "subtotal"
      ).textContent = `₹${subtotal.toLocaleString()}`;
      document.getElementById(
        "total-price"
      ).textContent = `${total.toLocaleString()}`;
    } else {
      document.getElementById("num-nights").textContent = "0";
      document.getElementById("subtotal").textContent = "₹0.00";
      document.getElementById("total-price").textContent = "0.00";
    }
  }
});
