
document.addEventListener('DOMContentLoaded', () => {
    const name = document.getElementById('name').value;
        const meja = document.getElementById('meja').value;
    const orderList = document.getElementById('order-list');
    


        orderElement.innerHTML = `
            <p>Nama: $${name}</p>
            <p>Meja: $${meja}</p>

            <hr />
        `;
        orderList.appendChild(orderElement);
    });
