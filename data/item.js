const items = [];

const addItem = (item) => {
    items.push(item);
};

const removeItem = (itemId) => {
    const index = items.findIndex((item) => item.id === itemId);
    if (index !== -1) {
        items.splice(index, 1);
    }
};

const makeOffer = (itemId) => {
    const item = items.find((item) => item.id === itemId);

    item.price = Number(item.price);

    if (item) {
        item.price += 5;
    } else {
        throw new Error("Item not found");
    }
};

module.exports = { items, addItem, removeItem, makeOffer };
