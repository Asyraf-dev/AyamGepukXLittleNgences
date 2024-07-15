document.addEventListener('DOMContentLoaded', () => {
    const cartItems = [];
    const totalPriceElement = document.getElementById('totalPrice');
    const cartItemsTable = document.getElementById('cartItems');
    const orderForm = document.getElementById('orderForm');
    const printReceiptButton = document.getElementById('printReceiptButton');
    const receipt = document.getElementById('receipt');
    const receiptName = document.getElementById('receiptName');
    const receiptItems = document.getElementById('receiptItems').getElementsByTagName('tbody')[0];
    const receiptTotalPrice = document.getElementById('receiptTotalPrice');

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

            item.subtotal = itemPrice; // Store subtotal in item object
            totalPrice += itemPrice;
        });
        totalPriceElement.textContent = `RM ${totalPrice.toFixed(2)}`;
    };

    const updateCartTable = () => {
        cartItemsTable.innerHTML = '';
        cartItems.forEach((item, index) => {
            const row = cartItemsTable.insertRow();

            const itemNameCell = row.insertCell(0);
            itemNameCell.textContent = item.name;

            const itemPriceCell = row.insertCell(1);
            itemPriceCell.textContent = `RM ${item.price.toFixed(2)}`;

            const itemQuantityCell = row.insertCell(2);
            itemQuantityCell.textContent = item.quantity;

            const addOnsCell = row.insertCell(3);
            if (item.addOns.length > 0) {
                let addOnsText = '';
                item.addOns.forEach(addOn => {
                    addOnsText += `${addOn.name} x ${addOn.quantity}, `;
                });
                addOnsCell.textContent = addOnsText.slice(0, -2); // Remove trailing comma and space
            } else {
                addOnsCell.textContent = '-';
            }

            const subtotalCell = row.insertCell(4);
            subtotalCell.textContent = `RM ${item.subtotal.toFixed(2)}`;

            const removeButtonCell = row.insertCell(5);
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove-item');
            removeButton.dataset.index = index;
            removeButton.addEventListener('click', removeItem);
            removeButtonCell.appendChild(removeButton);
        });

        calculateTotalPrice();
    };

    const removeItem = (event) => {
        const index = event.target.dataset.index;
        cartItems.splice(index, 1);
        updateCartTable();
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

            updateCartTable();
        });
    });

    orderForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const totalPrice = totalPriceElement.textContent;
        const items = cartItems.map(item => {
            return {
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                addOns: item.addOns
            };
        });

        const orderDetails = {
            name: name,
            totalPrice: totalPrice,
            items: items
        };

        const webAppURL = 'https://script.google.com/macros/library/d/1g8tfdKnad2zlKwGN1okX_w7-Xb3FzfXRZ6M7nohsy4YoRgJKQtKU9Lj6/1'; // Replace with your Google Apps Script Web App URL

        fetch(webAppURL, {
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
            alert('Order sent to Google Spreadsheet!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to send order to Google Spreadsheet.');
        });
    });

    printReceiptButton.addEventListener('click', function() {
        // Populate receipt details
        const name = document.getElementById('name').value;
        const totalPrice = totalPriceElement.textContent;

        receiptName.textContent = `Name: ${name}`;
        receiptTotalPrice.textContent = totalPrice;

        receiptItems.innerHTML = ''; // Clear previous items

        cartItems.forEach(item => {
            const row = receiptItems.insertRow();

            const itemNameCell = row.insertCell(0);
            itemNameCell.textContent = item.name;

            const itemPriceCell = row.insertCell(1);
            itemPriceCell.textContent = `RM ${item.price.toFixed(2)}`;

            const itemQuantityCell = row.insertCell(2);
            itemQuantityCell.textContent = item.quantity;

            const addOnsCell = row.insertCell(3);
            if (item.addOns.length > 0) {
                let addOnsText = '';
                item.addOns.forEach(addOn => {
                    addOnsText += `${addOn.name} x ${addOn.quantity}, `;
                });
                addOnsCell.textContent = addOnsText.slice(0, -2); // Remove trailing comma and space
            } else {
                addOnsCell.textContent = '-';
            }

            const subtotalCell = row.insertCell(4);
            subtotalCell.textContent = `RM ${item.subtotal.toFixed(2)}`;
        });

        // Show the receipt and trigger print dialog
        receipt.style.display = 'block';
        window.print();
        receipt.style.display = 'none';
    });

    // Initial cart table update
    updateCartTable();
});
