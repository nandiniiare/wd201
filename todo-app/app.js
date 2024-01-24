const express = require('express');
const app = express();
const csrf = require('tiny-csrf');

const flash = require("connect-flash");
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
app.set("views", path.join(__dirname, "views"));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('shh! some secret string'));
app.use(csrf('this_should_be_32_character_long', ['POST', 'PUT', 'DELETE']));
app.use(session({
  secret: "my-super-secret-key-21728172615261562",
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));
app.use(function(request, response, next) {
  response.locals.messages = request.flash();
  next();
});
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (username, password, done)=>{
  User.findOne({ where: { email: username } })
  .then(async function (user) {
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Invalid password" });
    }
  })
  .catch((error) => {
    return done(err);
  });
}));


passport.serializeUser((user, done)=>{
  console.log("Serializing user in session", user.id)
  done(null, user.id)
});

passport.deserializeUser((id, done)=>{
  User.findByPk(id)
  .then(user => {
    done(null, user)
  })
  .catch(error =>{
    done(error, null)
  })
});

const { Todo, User } = require('./models');
const { error } = require('console');
const user = require('./models/user');
const { get } = require('http');
app.set('view engine', 'ejs');


app.get('/', async (request, response) => {
  if (request.isAuthenticated()) {
    // Redirect to "/todos" if the user is logged in
    return response.redirect("/todos");
  }
      response.render('index', {
        title: 'Todo application',
        csrfToken: request.csrfToken(),
      });
});

app.get("/todo", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
  try {
    const loggedInUser = request.user.id;
    const allTodos = await Todo.getTodos();
    const overdue = await Todo.overdue(loggedInUser);
    const dueToday = await Todo.dueToday(loggedInUser);
    const dueLater = await Todo.dueLater(loggedInUser);
    const completedItems = await Todo.completedItems(loggedInUser);
    if (request.accepts('html')) {
      response.render('todo', {
        title: 'Todo application',
        allTodos,
        overdue,
        dueToday,
        dueLater,
        completedItems,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({
        overdue,
        dueToday,
        dueLater,
        completedItems,
      });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/signup", (request, response) => {
  response.render("signup", { title: "Signup" , 
  csrfToken: request.csrfToken(),
})
})
app.get("/login", (request, response) =>{
  response.render("login", {title: "Login", csrfToken: request.csrfToken()});
})
 
app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (request, response) {
    console.log(request.user);
    response.redirect("/todo");
  }
);
app.post("/users", async (request, response) => {
  if (request.body.email.length == 0) {
    request.flash("error", "please fill the email");
    return response.redirect("/signup");
  }

  if (request.body.firstName.length == 0) {
    request.flash("error", "please fill the First name");
    return response.redirect("/signup");
  }

  if (request.body.lastName.length == 0) {
    request.flash("error", "please fill the Last name");
    return response.redirect("/signup");
  }

  if (request.body.password.length < 8) {
    request.flash("error", "please fill 8 characters Password");
    return response.redirect("/signup");
  }
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds)
  console.log(hashedPwd)
  try{
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedPwd
    });
    request.login(user, (err) => {
      if(err) {
        console.log(err)
      }
      response.redirect("/todo");
    })
  }catch (error){
    console.log(error);
  }
})
app.get('/todos', async (_request, response) => {
  console.log('Fetch all todos: ');
  try {
    const allTodos = await Todo.findAll();
    response.send(allTodos);
  } catch (error) {
    console.error(error);
    response.status(422).json(error);
  }
});

app.get('/signout', (request, response, next)=> {
  request.logout((err)=> {
    if(err) { return next(err);}
    response.redirect("/");
  })
})

app.post('/todo',connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
  if (request.body.title.length == 0) {
    request.flash("error", "aka blank text");
    return response.redirect("/todos");
  }

  if (request.body.dueDate.length == 0) {
    request.flash("error", "aka blank due_date");
    return response.redirect("/todos");
  }

  console.log('Creating a todo', request.body);
  console.log(request.user);
  try {
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,  
      userId: request.user.id
    });
    return response.redirect('/todo');
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put('/todos/:id', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  console.log('Updating a todo with ID:', req.params.id);
  try {
    const todoId = req.params.id;
    const { completed } = req.body;

    const todo = await Todo.findByPk(todoId);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await todo.update({ completed });

    const updatedTodo = await Todo.findByPk(todoId);

    res.status(200).json({ message: 'Todo updated successfully', todo: updatedTodo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/todos/:id',connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  try {
    const todoId = req.params.id;
    const todo = await Todo.findByPk(todoId);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await todo.destroy();

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = app;
