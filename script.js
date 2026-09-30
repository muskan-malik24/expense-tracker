// ========================================
// DOM ELEMENTS
// ========================================

const expenseForm =
    document.querySelector("#expenseForm");

const expenseName =
    document.querySelector("#expenseName");

const expenseAmount =
    document.querySelector("#expenseAmount");

const expenseCategory =
    document.querySelector("#expenseCategory");

const totalExpense =
    document.querySelector("#totalExpense");

const transactionCount =
    document.querySelector("#transactionCount");

const expenseList =
    document.querySelector("#expenseList");

const message =
    document.querySelector("#message");

const searchInput =
    document.querySelector("#searchInput");

const filterCategory =
    document.querySelector("#filterCategory");



// ========================================
// LOAD EXPENSES FROM LOCAL STORAGE
// ========================================

let expenses =
    JSON.parse(
        localStorage.getItem("expenses")
    ) || [];



// ========================================
// SAVE EXPENSES
// ========================================

function saveExpenses() {

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

}



// ========================================
// SHOW MESSAGE
// ========================================

function showMessage(text) {

    message.innerText = text;


    setTimeout(function () {

        message.innerText = "";

    }, 2000);

}



// ========================================
// CALCULATE TOTAL
// ========================================

function calculateTotal(list) {

    let total = list.reduce(
        function (sum, expense) {

            return sum + Number(expense.amount);

        },
        0
    );


    totalExpense.innerText =
        total.toLocaleString("en-IN");

}



// ========================================
// DISPLAY EXPENSES
// ========================================

function displayExpenses(list = expenses) {

    // Clear old list
    expenseList.innerHTML = "";


    // Update total
    calculateTotal(list);


    // Update transaction count
    transactionCount.innerText =
        list.length;


    // If no expenses
    if (list.length === 0) {

        expenseList.innerHTML = `
            <div class="empty">
                No expenses found.
            </div>
        `;

        return;
    }


    // Create cards
    list.forEach(function (expense) {

        // Card
        const card =
            document.createElement("div");

        card.classList.add(
            "expense-card"
        );


        // Information
        const info =
            document.createElement("div");

        info.classList.add(
            "expense-info"
        );


        // Name
        const title =
            document.createElement("h3");

        title.innerText =
            expense.name;


        // Details
        const details =
            document.createElement("p");

        details.innerText =
            "₹" +
            Number(expense.amount)
                .toLocaleString("en-IN") +
            "  •  " +
            expense.category;


        // Add information
        info.appendChild(title);

        info.appendChild(details);


        // Delete button
        const deleteBtn =
            document.createElement("button");

        deleteBtn.innerText =
            "Delete";

        deleteBtn.classList.add(
            "delete-btn"
        );


        // Delete event
        deleteBtn.addEventListener(
            "click",
            function () {

                expenses =
                    expenses.filter(
                        function (item) {

                            return item.id !==
                                expense.id;

                        }
                    );


                // Save updated array
                saveExpenses();


                // Refresh display
                applyFilters();


                // Message
                showMessage(
                    "Expense deleted!"
                );

            }
        );


        // Add everything
        card.appendChild(info);

        card.appendChild(deleteBtn);

        expenseList.appendChild(card);

    });

}



// ========================================
// ADD EXPENSE
// ========================================

expenseForm.addEventListener(
    "submit",
    function (event) {

        // Stop page refresh
        event.preventDefault();


        // Get values
        const name =
            expenseName.value.trim();

        const amount =
            expenseAmount.value;

        const category =
            expenseCategory.value;


        // Validation
        if (
            name === "" ||
            amount === "" ||
            category === ""
        ) {

            showMessage(
                "Please fill all fields!"
            );

            return;
        }


        // Amount validation
        if (Number(amount) <= 0) {

            showMessage(
                "Amount must be greater than 0!"
            );

            return;
        }


        // Create expense object
        const expense = {

            id: Date.now(),

            name: name,

            amount: Number(amount),

            category: category

        };


        // Add object to array
        expenses.push(expense);


        // Save
        saveExpenses();


        // Update screen
        applyFilters();


        // Clear form
        expenseForm.reset();


        // Success message
        showMessage(
            "Expense added successfully!"
        );

    }
);



// ========================================
// SEARCH + CATEGORY FILTER
// ========================================

function applyFilters() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedCategory =
        filterCategory.value;


    const filteredExpenses =
        expenses.filter(
            function (expense) {


                // Search condition
                const matchesSearch =
                    expense.name
                        .toLowerCase()
                        .includes(searchText);


                // Category condition
                const matchesCategory =
                    selectedCategory === "All" ||
                    expense.category ===
                    selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    displayExpenses(
        filteredExpenses
    );

}



// ========================================
// SEARCH EVENT
// ========================================

searchInput.addEventListener(
    "input",
    function () {

        applyFilters();

    }
);



// ========================================
// CATEGORY FILTER EVENT
// ========================================

filterCategory.addEventListener(
    "change",
    function () {

        applyFilters();

    }
);



// ========================================
// INITIAL DISPLAY
// ========================================

displayExpenses();