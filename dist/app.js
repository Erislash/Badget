document.addEventListener('DOMContentLoaded', StartApp);

function StartApp(){
    class Budget{
        budget;
        remain;
        constructor(budget){
            
            // this.budget = budget;
            this.remain = budget;
            this.expenses = [];
        }

        NewBudget(budget){
            this.budget = budget;
        }

        UpdateRemain(){
            let newRemain = this.budget - (this.expenses.reduce((a, b)=> a + b.amount, 0));
            this.remain = newRemain;
        }

        NewExpense(expense){
            this.expenses = [...this.expenses, expense];
        }

        RemoveExpense(id){
            this.expenses = this.expenses.filter((e)=>{
                return e.id != id
            });
        }
    }

    class UI{
        PrintBudget(p_budget){
            document.querySelector('#currentBudget').textContent = `$${p_budget.budget}`;
            document.querySelector('#remainingBudget').textContent = `$${p_budget.remain}`;
        }

        PrintAlert(p_message, p_type){
            inAddMessage.textContent = p_message;
            inAddMessage.style.display = 'inline-block';
            if(p_type === 'error'){
                inAddMessage.style.color = 'rgb(100, 0, 0)';
                inAddMessage.style.backgroundColor = 'rgb(185, 94, 94)';
                inAddMessage.style.border = '1px solid rgb(100, 0, 0)';
            }else{
                inAddMessage.style.color = 'rgb(38, 83, 26)';
                inAddMessage.style.backgroundColor = 'rgb(113, 235, 82)';
                inAddMessage.style.border = '1px solid rgb(38, 83, 26)';
            }
        }

        PrintExpense(expenses){
            console.log(expenses);
            expensesList.innerHTML = "";

            expenses.forEach(e=>{
                let expense = document.createElement('li');
                expense.setAttribute("data-id", e.id);
                expense.innerHTML = `   <div class="expenseName">${e.expense}</div>
                                        <div class="price">$${e.amount}</div>
                                        <div class="remove"><i class="fas fa-times-circle"></i></div>`;
    
                
                expensesList.appendChild(expense);
            });
            
        }

        PrintRemain(remain){
            document.querySelector('#remainingBudget').textContent = `$${remain}`;
        }
    }
    
    const addFields = document.querySelectorAll('.addField');
    const expensesList = document.querySelector('#expensesList');
    const myBudget = document.querySelector('#myBudget');
    let weeklyBudget = myBudget.value;
    let budget = new Budget(weeklyBudget);
    
    const ui = new UI();

    const submitForm = document.querySelector('#submitForm');

    const inAddMessage = document.querySelector('#addMessage');

    let removeBtn = document.querySelectorAll('.remove');


    Listeners();
    function Listeners(){
        addFields.forEach((input)=>{
            input.querySelector('input').value = "";
            input.querySelector('input').addEventListener('input', AnimateFields);
        });

        myBudget.addEventListener('input', Getbudget);
        submitForm.addEventListener('click', AddExpense);
    }

    function AnimateFields(input){
        if(input.target.value != "")
            input.target.parentNode.classList.add('active');
        else
            input.target.parentNode.classList.remove('active');
    }
    
    function Getbudget(input){
        const numRegEx = new RegExp(/^\d+(.\d+)?$/);

        if(numRegEx.test(input.target.value))
            weeklyBudget = input.target.value;
        else
            weeklyBudget = 0

        // budget = new Budget(weeklyBudget);
        budget.NewBudget(weeklyBudget);
        ui.PrintBudget(budget);
        budget.UpdateRemain();
        ui.PrintRemain(budget.remain);
    }

    function AddExpense(e){
        e.preventDefault();

        const expense = document.querySelector('#expense').value;
        let amount = document.querySelector('#amount').value;

        const regNum = new RegExp(/^\d+(.\d+)?$/);

        if(expense === "" || amount === ""){
            ui.PrintAlert("Some field is empty", 'error');
            return
        }
        else if(!regNum.test(amount)){
            ui.PrintAlert("Amount MUST be a POSITIVE NUMBER", 'error');
            return
        }
        else
            ui.PrintAlert("Expense added", 'ok');

        amount = Number(amount);
        const makeExpense = {expense, amount, id: Date.now()};

        budget.NewExpense(makeExpense);

        ui.PrintExpense(budget.expenses);

        budget.UpdateRemain();

        ui.PrintRemain(budget.remain);

        UpdateRemoveButtons();
    }

    function RemoveExpenseFromList(btn){
        console.log(btn.target.parentElement.parentElement.dataset.id);
        if(btn.target.parentElement.parentElement.dataset.id){
           
            budget.RemoveExpense(btn.target.parentElement.parentElement.dataset.id);
            budget.UpdateRemain();
            ui.PrintExpense(budget.expenses)
            ui.PrintRemain(budget.remain);

            UpdateRemoveButtons();
        }
    }

    function UpdateRemoveButtons(){
        removeBtn = document.querySelectorAll('.remove');
        removeBtn.forEach(btn => {
            btn.addEventListener('click', RemoveExpenseFromList);
        });
    }
}
