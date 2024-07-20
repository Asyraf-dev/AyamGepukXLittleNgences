
document.addEventListener('DOMContentLoaded', () => {
    const name = document.getElementById('name').value;
        const meja = document.getElementById('meja').value;
    const orderList = document.getElementById('order-list');
    const allOrders = JSON.parse(localStorage.getItem('allOrder')) || [];

    allOrders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.classList.add('order');
        orderElement.innerHTML = `
            <h3>Order ID: ${order.id}</h3>
            <p>Date: ${new Date(order.timestamp).toLocaleString()}</p>
            <p>Nama: $${name}</p>
            <p>Meja: $${meja}</p>

            <hr />
        `;
        orderList.appendChild(orderElement);
    });
});
