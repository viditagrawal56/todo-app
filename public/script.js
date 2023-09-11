//FUNCTIONALITY TO ADD THE TODOS IF ENTER IS PRESSED
document.addEventListener("keyup", function (event) {
  // Check if the pressed key is "Enter"
  if (event.key === "Enter") {
    addTodos(); //CALL THE FUNCTION TO ADD THE TODOS
  }
});

//CALLING THE GET FUNCTION AT THE START TO GET ALL THE TODOS AS SOON AS THE PAGE RELOADS
getTodos();

//FUNCTION TO GET ALL THE TODOS
async function getTodos() {
  //GET THE CONTAINER OF ALL THE TODOS
  const todoContainer = document.getElementById("todo_container");
  //CLEARING ALL THE EXISITING TODOS
  todoContainer.innerHTML = "";
  try {
    const resp = await fetch("http://localhost:3000/todos", {
      method: "GET",
    });
    resp.json().then((data) => {
      console.log(data);

      //ITERATE OVER ALL THE TODOS AND CREATE ELEMENTS
      data.forEach((todo) => {
        //CREATING ALL THE INDIVIDUAL CARD ELEMENTS
        const cardContainer = document.createElement("div");
        cardContainer.classList.add("card_container");

        const todoTitle = document.createElement("p");
        todoTitle.classList.add("todo_title");
        todoTitle.textContent = todo.title;

        const line = document.createElement("span");
        line.classList.add("line");

        const todoDescription = document.createElement("p");
        todoDescription.classList.add("todo_description");
        todoDescription.textContent = todo.description;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("btn");
        deleteBtn.classList.add("delete_btn");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
          deleteTodos(todo.id);
        });

        //APPENDING ALL OF THE ELEMENTS INTO THE CARD
        cardContainer.appendChild(todoTitle);
        cardContainer.appendChild(line);
        cardContainer.appendChild(todoDescription);
        cardContainer.appendChild(deleteBtn);

        //APPENDING THE CARD INTO THE TODO CONTAINER
        todoContainer.appendChild(cardContainer);
      });
    });
  } catch (err) {
    console.log(err);
  }
}

//FUNCTIONALITY TO DELETE THE TODOS
async function deleteTodos(id) {
  try {
    const res = await fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      // Fetch and update the todos list again
      await getTodos();
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

//FUNCTIONALITY FOR THE ADD BUTTON
async function addTodos() {
  try {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    //CHECK IF THE INPUT FIELDS ARE EMPTY POST IF NOT
    if (title == "" || description == "") {
      alert("Please Enter Title and Description both");
    } else {
      const resp = await fetch("http://localhost:3000/todos", {
        method: "POST",
        body: JSON.stringify({
          title: title,
          description: description,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });

      resp.json().then((data) => {
        console.log(data);
        //GET ALL TODOS AGAIN TO UPDATE LIST AGAIN AFTER POSTING
        getTodos();
      });
    }
  } catch (err) {
    console.log(err);
  }
  //CLEAR THE INPUT FIELDS
  title.value = "";
  description.value = "";
}
