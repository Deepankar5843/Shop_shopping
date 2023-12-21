class Product {
    constructor(itemName, itemDescription, itemPrice, itemQuantity) {
        this.itemName = itemName;
        this.itemDescription = itemDescription;
        this.itemPrice = itemPrice;
        this.itemQuantity = itemQuantity;
    }


    createShopItem() {

        //   var itemList = document.getElementById()

        var Shopitem = document.createElement('li');
        Shopitem.textContent = 'Item: ' + this.itemName + 'Description: ' + this.itemDescription + 'Price: ' + this.itemPrice + 'Quantity: ' + this.itemQuantity;

        var deleteButton = document.createElement('button');
        //  deleteButton.type='button';
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'deleteButton';
        deleteButton.addEventListener('click', () => { this.deleteItem(Shopitem) });

        var editbutton = document.createElement('button');
        editbutton.textContent = 'Edit';
        editbutton.className = 'editButton';
        editbutton.addEventListener('click', () => { this.editItem(Shopitem) });

        var buyButton = document.createElement('button');
        buyButton.textContent = 'Buy';
        buyButton.className = 'buyButton';
        buyButton.addEventListener('click', () => { this.buyItem(Shopitem) });


        Shopitem.insertBefore(buyButton, Shopitem.firstChild.nextSibling);
        Shopitem.insertBefore(editbutton, Shopitem.firstChild.nextSibling);
        Shopitem.insertBefore(deleteButton, Shopitem.firstChild.nextSibling);


        return Shopitem;
    }

    deleteItem(Shopitem) {

        console.log('Deleting item: ', this.itemName);

        var itemId = Shopitem.dataset.itemId;

        Shopitem.parentNode.removeChild(Shopitem);

        axios.delete(`https://crudcrud.com/api/dd85cf7f68d34de58f609e9d696da8d3/Itemsdata/${itemId}`)
            .then((response) => {
                console.log('Delete: ', response);
            })
            .catch((err) => {
                console.log('Error: ', err);
            });
    }

    editItem(Shopitem) {

        var editForm = document.createElement('form');

        var itemNameInput = document.createElement('input');
        itemNameInput.type = 'text';
        itemNameInput.value = this.itemName;

        var itemDescriptionInput = document.createElement('input');
        itemDescriptionInput.type = 'text';
        itemDescriptionInput.value = this.itemDescription;

        var itemPriceInput = document.createElement('input');
        itemPriceInput.type = 'number';
        itemPriceInput.value = this.itemPrice;

        var itemQuantityInput = document.createElement('input');
        itemQuantityInput.type = 'number';
        itemQuantityInput.value = this.itemQuantity;

        var saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        console.log(saveButton);
        saveButton.addEventListener('click', () => { this.saveChanges(Shopitem, itemNameInput.value, itemDescriptionInput.value, itemPriceInput.value, itemQuantityInput.value) });

        editForm.appendChild(itemNameInput);
        editForm.append(itemDescriptionInput);
        editForm.appendChild(itemPriceInput);
        editForm.appendChild(itemQuantityInput);
        editForm.appendChild(saveButton);

        Shopitem.innerHTML = '';
        Shopitem.appendChild(editForm);
    }


    saveChanges(Shopitem, newItem, newDescription, newPrice, newQuantity) {
        this.itemName = newItem;
        this.itemDescription = newDescription;
        this.itemPrice = newPrice;
        this.itemQuantity = newQuantity;

        // Example: Create new elements or use templates for consistency
        var newContent = document.createElement('span');
        newContent.textContent = `Item Name: ${this.itemName}, Description: ${this.itemDescription}, Price: ${this.itemPrice}, Quantity: ${this.itemQuantity}`;

        // Clear existing content and append new content
        Shopitem.innerHTML = '';
        Shopitem.appendChild(newContent);

        var itemId = Shopitem.dataset.itemId;

        axios.put(`https://crudcrud.com/api/dd85cf7f68d34de58f609e9d696da8d3/Itemsdata/${itemId}`, {
            item_Name: `${this.itemName}`,
            item_Description: `${this.itemDescription}`,
            item_Price: `${this.itemPrice}`,
            item_Quantity: `${this.itemQuantity}`
        })
            .then(response => {
                // Handle success if needed
                console.log('Save successful:', response);
            })
            .catch(error => {
                // Handle error if needed
                console.error('Save error:', error);
            });
    }




    buyItem(Shopitem) {
        var itemQuantityUnit = this.itemQuantity;

        if (itemQuantityUnit <= 0) {
            return alert('Item is not available');
        }

        this.itemQuantity = --itemQuantityUnit;

        var itemId = Shopitem.dataset.itemId;

        axios.put(`https://crudcrud.com/api/dd85cf7f68d34de58f609e9d696da8d3/Itemsdata/${itemId}`, {
            item_Name: `${this.itemName}`,
            item_Description: `${this.itemDescription}`,
            item_Price: `${this.itemPrice}`,
            item_Quantity: `${this.itemQuantity}`
        })
            .then(response => {
                // Handle success if needed
                console.log('Buy successful:', response);
            })
            .catch(error => {
                // Handle error if needed
                console.error('Buy error:', error);
            });
    }





    // buyItem(Shopitem) {


    //     var itemQuantityUnit = this.itemQuantity;

    //     if (itemQuantityUnit === 0) {
    //         return alert('Item is not available');
    //     }


    //     this.itemQuantity = itemQuantityUnit--;

    //     var itemId = Shopitem.dataset.itemId;

    //     axios
    //         .put(`https://crudcrud.com/api/dd85cf7f68d34de58f609e9d696da8d3/Itemsdata/${itemId}`, {
    //             item_Quantity: `${this.itemQuantity}`
    //         })
    // }


}


function addItem() {
    // Retrieve values from the form
    var name = document.getElementById('itemName').value;
    var description = document.getElementById('itemDescription').value;
    var price = document.getElementById('itemPrice').value;
    var quantity = document.getElementById('itemQuantity').value;
    var itemList = document.getElementById('users');

    var itemName = name.trim();
    var itemDescription = description.trim();
    var itemPrice = price.trim();
    var itemQuantity = quantity.trim();

    if (itemName && itemDescription && itemPrice && itemQuantity) {
        var product = new Product(itemName, itemDescription, itemPrice, itemQuantity);

        var Shopitem = product.createShopItem();
        itemList.appendChild(Shopitem);

        var ans =
        {
            item_Name: itemName,
            item_Description: itemDescription,
            item_Price: itemPrice,
            item_Quantity: itemQuantity
        };

        axios.post("https://crudcrud.com/api/dd85cf7f68d34de58f609e9d696da8d3/Itemsdata", ans)
            .then((response) => {
                console.log(response);
                fetchData();
            })
            .catch((err) => {
                console.log(err);
            })

        // Clear the input fields
        name.value = '';
        description.value = '';
        price.value = '';
        quantity.value = '';
    }
    else {
        alert('Please enter all inputs');
    }


    console.log("Item Name:", itemName);
    console.log("Description:", itemDescription);
    console.log("Price:", itemPrice);
    console.log("Quantity:", itemQuantity);
}



function fetchData() {
    axios.get('https://crudcrud.com/api/dd85cf7f68d34de58f609e9d696da8d3/Itemsdata')
        .then((res) => {
            updateItem(res.data);
        })
        .catch((err) => {
            console.error(err);
        })
}


function updateItem(itemData) {

    var itemList = document.getElementById('users');
    itemList.innerHTML = '';

    itemData
        .forEach(element => {
            var item = new Product(element.item_Name, element.item_Description, element.item_Price, element.item_Quantity);
            var Shopitem = item.createShopItem();
            Shopitem.dataset.itemId = element._id;
            itemList.appendChild(Shopitem);
        });


}

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

