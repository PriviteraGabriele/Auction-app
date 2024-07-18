document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const loginConteiner = document.getElementById("login-container");
    const registerConteiner = document.getElementById("register-container");
    const authenticationConteiner = document.getElementById(
        "authentication-container"
    );
    const dashboardConteiner = document.getElementById("dashboard-container");
    const showRegisterBtn = document.getElementById("show-register-form-btn");
    const showLoginBtn = document.getElementById("show-login-form-btn");
    const auctionItemForm = document.getElementById("auction-item-form");
    const auctionItemList = document.getElementById("items");

    if (showRegisterBtn) {
        showRegisterBtn.addEventListener("click", () => {
            loginConteiner.style.display = "none";
            registerConteiner.style.display = "block";
        });
    }

    if (showLoginBtn) {
        showLoginBtn.addEventListener("click", () => {
            registerConteiner.style.display = "none";
            loginConteiner.style.display = "block";
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            try {
                await axios.post("/login", { email, password });
                authenticationConteiner.style.display = "none";
                dashboardConteiner.style.display = "block";
            } catch (error) {
                alert(error.response.data);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("register-email").value;
            const password = document.getElementById("register-password").value;

            try {
                await axios.post("/register", { email, password });
                registerConteiner.style.display = "none";
                loginConteiner.style.display = "block";
            } catch (error) {
                alert(error.response.data);
            }
        });
    }

    let socket;

    if (auctionItemForm) {
        socket = io();

        auctionItemForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const item = {
                id: Date.now(),
                name: document.getElementById("item-name").value,
                price: document.getElementById("item-base-price").value,
                currentOfferer: "",
            };
            socket.emit("addItem", item);
        });

        socket.on("items", (items) => {
            auctionItemList.innerHTML = "";
            items.forEach((item) => {
                const li = document.createElement("li");
                li.textContent =
                    item.name +
                    " " +
                    item.currentOfferer +
                    " " +
                    item.price +
                    "$";
                li.dataset.id = item.id;

                const offerButton = createMakeOffer(item.id);
                li.appendChild(offerButton);

                const removeButton = createRemoveButton(item.id);
                li.appendChild(removeButton);

                auctionItemList.appendChild(li);
            });
        });

        function createMakeOffer(itemId) {
            const button = document.createElement("button");
            button.id = "offerButton";
            button.textContent = "Fai un'offerta di + 5$";
            button.addEventListener("click", () => {
                if (socket) {
                    socket.emit("makeOffer", itemId);
                } else {
                    console.error("Socket non è definito");
                }
            });
            return button;
        }

        function createRemoveButton(itemId) {
            const button = document.createElement("button");
            button.id = "removeButton";
            button.textContent = "Rimuovi";
            button.addEventListener("click", () => {
                if (socket) {
                    socket.emit("removeItem", itemId);
                } else {
                    console.error("Socket non è definito");
                }
            });
            return button;
        }

        // TODO: aggiungere all'item in conto alla rovescia per la fine dell'asta per l'item e gestiere la notifica che appena scade stampa il nome dell'oggetto e il prezzo finale
    }
});
