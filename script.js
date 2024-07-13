document.addEventListener('DOMContentLoaded', () => {
    const cartItems = [];
    const totalPriceElement = document.getElementById('totalPrice');
    const cartItemsElement = document.getElementById('cartItems');
    const orderForm = document.getElementById('orderForm');

    const calculateTotalPrice = () => {
        let totalPrice = 0;
        cartItems.forEach(item => {
            let itemPrice = item.price * item.quantity;

            // Add prices for add-ons
            if (item.addOns.length > 0) {
                item.addOns.forEach(addOn => {
                    itemPrice += parseFloat(addOn.price) * addOn.quantity;
                });
            }

            totalPrice += itemPrice;
        });
        totalPriceElement.textContent = `RM ${totalPrice.toFixed(2)}`;
    };

    const updateCart = () => {
        cartItemsElement.innerHTML = '';
        cartItems.forEach((item, index) => {
            const li = document.createElement('li');
            let itemDescription = `${item.name} - RM ${item.price.toFixed(2)} x ${item.quantity}`;

            if (item.addOns.length > 0) {
                itemDescription += ' (';
                item.addOns.forEach((addOn, addOnIndex) => {
                    if (addOnIndex > 0) itemDescription += ', ';
                    itemDescription += `${addOn.name} x ${addOn.quantity} (+RM ${(parseFloat(addOn.price) * addOn.quantity).toFixed(2)})`;
                });
                itemDescription += ')';
            }

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove-item');
            removeButton.dataset.index = index;
            removeButton.addEventListener('click', removeItem);
            
            li.textContent = itemDescription;
            li.appendChild(removeButton);
            cartItemsElement.appendChild(li);
        });
        calculateTotalPrice();
    };

    const removeItem = (event) => {
        const index = event.target.dataset.index;
        cartItems.splice(index, 1);
        updateCart();
    };

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', event => {
            const menuItem = event.target.closest('.menuItem');
            const itemName = menuItem.getAttribute('data-name');
            const itemPrice = parseFloat(menuItem.getAttribute('data-price'));
            const itemQuantity = parseInt(menuItem.querySelector('.quantity').value, 10);
            
            const addOns = Array.from(menuItem.querySelectorAll('.addon-quantity')).map(input => {
                return {
                    name: input.name.replace('Qty', ''),
                    price: input.getAttribute('data-price'),
                    quantity: parseInt(input.value, 10)
                    
                };
            }).filter(addOn => addOn.quantity > 0);
            
            

            
            

            const existingItem = cartItems.find(item => item.name === itemName && JSON.stringify(item.addOns) === JSON.stringify(addOns));
            if (existingItem) {
                existingItem.quantity += itemQuantity;
                existingItem.addOns = addOns;
            } else {
                cartItems.push({ name: itemName, price: itemPrice, quantity: itemQuantity, addOns: addOns });
            }

            updateCart();
        });
    });

    orderForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const meja = document.getElementById('meja').value;
        let orderDetailsContent = `New Order Received!\nName: ${name}\nMeja: ${meja}\n`;

        cartItems.forEach(item => {
            orderDetailsContent += `${item.name} - RM ${item.price.toFixed(2)} x ${item.quantity}`;

            if (item.addOns.length > 0) {
                orderDetailsContent += ' (';
                item.addOns.forEach((addOn, index) => {
                    if (index > 0) orderDetailsContent += ', ';
                    orderDetailsContent += `${addOn.name} x ${addOn.quantity} (+RM ${(parseFloat(addOn.price) * addOn.quantity).toFixed(2)})`;
                });
                orderDetailsContent += ')';
            }

            orderDetailsContent += `\n`;
        });

        const totalPrice = totalPriceElement.textContent;
        orderDetailsContent += `Total Price: ${totalPrice}`;

        const webhookURL = 'https://discordapp.com/api/webhooks/1261613962420686880/t1dVMRQt2qnOf2I4UJ_O0j-YQii0nOXXRf8M5sf63E_tY7jKdwinHf2pnvwU4-zVDxio'; // Replace with your webhook URL

        const orderDetails = {
            content: orderDetailsContent
        };

        fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderDetails)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert(`Menu: ${orderDetailsContent}\n\n\nTerima Kasih Kerana Sentiasa Support Kami\nSelamat Menjamu Selera\nSupport our Little Ngences Coffe\n-Ayam Gepuk X Little Ngences-`);;
        })
        .catch((error) => {
            console.error('Error:', error);
            alert(`Menu: ${orderDetailsContent}\n\n\nTerima Kasih Kerana Sentiasa Support Kami\nSelamat Menjamu Selera\nSupport our Little Ngences Coffe\n-Ayam Gepuk X Little Ngences-`);;
        });
    });

    // Initial cart update
    updateCart();
});
