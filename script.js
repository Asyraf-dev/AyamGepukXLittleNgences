document.getElementById("goToCartBtn").addEventListener("click", function() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth" // Smooth scrolling animation
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const filterOptions = document.querySelectorAll('input[name="filter"]');
    const menuItems = document.querySelectorAll(".menuItem");

    filterOptions.forEach(option => {
        option.addEventListener("change", function () {
            const selectedCategory = this.value;

            menuItems.forEach(item => {
                if (selectedCategory === "all" || item.getAttribute("data-category") === selectedCategory) {
                    item.style.display = "block"; // Show item
                } else {
                    item.style.display = "none"; // Hide item
                }
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const cartItems = [];
    const totalPriceElement = document.getElementById('totalPrice');
    const cartItemsElement = document.getElementById('cartItems');
    const successMessage = document.getElementById('success-message');
    const orderForm = document.getElementById('orderForm');
    const submitButton = document.getElementById('submitButton');

    const calculateTotalPrice = () => {
        let totalPrice = 0;
        cartItems.forEach(item => {
            let itemPrice = item.price * item.quantity;
            item.addOns.forEach(addOn => {
                itemPrice += parseFloat(addOn.price) * addOn.quantity;
            });
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
                itemDescription += ' (' + item.addOns.map(addOn => `${addOn.name} (+RM ${parseFloat(addOn.price).toFixed(2)})`).join(', ') + ')';
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
        const index = parseInt(event.target.dataset.index, 10);
        cartItems.splice(index, 1);
        updateCart();
    };

    document.querySelectorAll('.add-to-cart').forEach(button => {
         button.style.backgroundColor = "#dc3545"; // Red color
        button.style.color = "white";
        button.style.border = "none";
        button.style.padding = "8px 15px";
        button.style.borderRadius = "8px"; // Rounded corners
        button.style.fontSize = "14px";
        button.style.fontWeight = "bold";
        button.style.cursor = "pointer";
        button.style.transition = "background 0.3s ease, transform 0.2s ease";
        button.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.2)";
    
        button.addEventListener('click', event => {
            const menuItem = event.target.closest('.menuItem');
            const itemName = menuItem.getAttribute('data-name');
            const itemPrice = parseFloat(menuItem.getAttribute('data-price'));
            const itemQuantity = parseInt(menuItem.querySelector('.quantity').value, 10);
            
            const addOns = Array.from(menuItem.querySelectorAll('.addon-checkbox:checked')).map(checkbox => {
                return {
                    name: checkbox.name,
                    price: checkbox.getAttribute('data-price'),
                    quantity: 1
                };
            });
            
            const existingItem = cartItems.find(item => item.name === itemName && JSON.stringify(item.addOns) === JSON.stringify(addOns));
            if (existingItem) {
                existingItem.quantity += itemQuantity;
            } else {
                cartItems.push({ name: itemName, price: itemPrice, quantity: itemQuantity, addOns: addOns });
            }
            
            updateCart();
            
            successMessage.textContent = `${itemName} (${itemQuantity}) added to cart!`;
            successMessage.style.opacity = 1;
            setTimeout(() => { successMessage.style.opacity = 0; }, 3000);
        });
    });
    

    orderForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const meja = document.getElementById('meja').value.trim();
        const special = document.getElementById('special').value.trim();

        if (!name || !meja) {
            alert("Please enter your name and table number.");
            return;
        }

        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        let orderDetails = `New Order Received!!\n👤Name: ${name}\n🪑Meja: ${meja}\n🤌Special Request: ${special}\n`;
        cartItems.forEach(item => {
            orderDetails += `${item.name} - RM ${item.price.toFixed(2)} x ${item.quantity}\n`;
            if (item.addOns.length > 0) {
                orderDetails += ' (' + item.addOns.map(addOn => `${addOn.name} (+RM ${parseFloat(addOn.price).toFixed(2)})`).join(', ') + ')';
            }
        });
        orderDetails += `\n\n💰Total Price: ${document.getElementById('totalPrice').textContent}`;

        const webhookURL = 'https://discordapp.com/api/webhooks/1340920048260354248/xVD3JTN0vZYxK8tmez_Uu38w03-fJPX2_w4n25uln726UpdljARrLaHJ2VEAFKDRBEGY';

        fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: orderDetails })
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            alert(`Order Submitted Successfully!\n${orderDetails}`);
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = "Submit Order";
                orderForm.submit();
            }, 3000);
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Failed to submit order. Please try again.");
            submitButton.disabled = false;
            submitButton.textContent = "Submit Order";
        });
    });



    const text = "Selamat Datang Ke Restoran Ayam Gepuk Ngences";
    const typewriterElement = document.getElementById('typewriter');
    let index = 0;
    function typeWriter() {
        if (index < text.length) {
            typewriterElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 100);
        }
    }
    

    const snowContainer = document.getElementById('snow-container');
    for (let i = 0; i < 100; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
        snowflake.style.animationDelay = `${Math.random() * 2}s`;
        snowContainer.appendChild(snowflake);
    }

    const audio = document.getElementById('background-music');
    function togglePlay() { audio.paused ? audio.play() : audio.pause(); }
    function stopMusic() { audio.pause(); audio.currentTime = 0; }
    function changeVolume(volume) { audio.volume = volume; }
});
