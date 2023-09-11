const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());
//READ THE TODOS FROM THE FILE
let todoItems;
fs.readFile("todos.json", "utf8", (err, data) => {
  if (err) throw err;
  todoItems = JSON.parse(data);
});

//FUNCTION TO GET THE INDEX OF A TODO USING ID
function getIndex(arr, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) return i;
  }
  return -1;
}

//FUNCTION TO DELETE A TODO GIVEN ITS INDEX
function deleteTodo(arr, index) {
  const newArray = [];
  for (let i = 0; i < arr.length; i++) {
    if (i !== index) newArray.push(arr[i]);
  }
  return newArray;
}

//GET ALL THE TODOS
app.get("/todos", (req, res) => {
  res.json(todoItems);
});

//GET A SPECIFIC TODO
app.get("/todos/:id", (req, res) => {
  const index = getIndex(todoItems, parseInt(req.params.id));
  if (index === -1) {
    res.status(404).send("Todo not Found");
  } else {
    res.json(todoItems[index]);
    res.status(200).send("Todo Found");
  }
});

//CREATE A NEW TODO AND POST IT
let curId = 0;
app.post("/todos", (req, res) => {
  let newTodo = {
    id: ++curId,
    title: req.body.title,
    description: req.body.description,
  };
  todoItems.push(newTodo);
  fs.writeFile("todos.json", JSON.stringify(todoItems), (err) => {
    if (err) throw err;
    res.status(201).json(todoItems);
  });
});

//DELETE A TODO
app.delete("/todos/:id", (req, res) => {
  let index = getIndex(todoItems, parseInt(req.params.id));
  if (index == -1) {
    res.status(404).json(["todo not found"]);
  } else {
    todoItems = deleteTodo(todoItems, index);
    fs.writeFile("todos.json", JSON.stringify(todoItems), (err) => {
      if (err) throw err;
      res.status(200).json(todoItems);
    });
  }
});

//UPDATE A TODO
app.put("/todos/:id", (req, res) => {
  let index = getIndex(todoItems, parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json(["Todo not Found"]);
  } else {
    const updatedTodo = {
      id: todoItems[index].id,
      title: req.body.title,
      description: req.body.description,
    };
    todoItems[index] = updatedTodo;
    fs.writeFile("todos.json", JSON.stringify(todoItems), (err) => {
      if (err) throw err;
      res.status(200).json(updatedTodo);
    });
  }
});

//serving the static html,css and js files
app.use(express.static(path.join(__dirname, "./public")));

//FOR ANY ROUTE NOT DEFINED
app.use((req, res, next) => {
  res.status(404).send();
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
