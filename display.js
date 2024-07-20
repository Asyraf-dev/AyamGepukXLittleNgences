
document.addEventListener('DOMContentLoaded', () => {
    const orderList = document.getElementById('order-list');
    const name = document.getElementById('name');
        const meja = document.getElementById('meja');
    
    


        orderElement.innerHTML = `
            <p>Nama: $${name}</p>
            <p>Meja: $${meja}</p>

            <hr />
        `;
        orderList.appendChild(orderElement);
    });
