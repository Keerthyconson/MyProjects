# Basic Login & Register Pages 
I'm trying to make a login and registration page using React on frontend and NodeJs on backend. I'm working to incorporate the basic things I learned, which includes
- HTML & CSS
- React
- Node JS
- Include testing - both frontend & backend
- MongoDB - database used
- Authentication 
- Git
- Upload to a cloud server 

#### **REACT**
> Import `react-router-dom` => for Routing<br/>
> Import `joi` => for Validation<br/>
> Import `config` => for configuration <br/>
> Import `react-router` => for history<br/>
> Import `jwt-decode` => for decoding <br/>
> Import `react-toastify` => for the alert messages <br/>

#### **NODE JS**
>Import `express`<br/>
>Import `joi`<br/>
>Import `mongoose`<br/>
>Import `bcrypt`<br/>
>Import `lodash`<br/>
>Import `jsonwebtoken` <br/>
>Import `config`<br/>
>Import `cors`<br/>

#### **Authentication & Authorization** 
>Table variables : <br/>
>- firstName
>- lastName
>- email
>- password <br/>

>We are authenticating with email & password. For that we follow the following steps:
>1. Create a user model.
>2. Create routes for both logging in and registering

> Before creating all these steps, we need to add the jwtprivateKey to our environment variables.<br/>
> For that we install the config module & create a config folder.<br/>
> Inside the config folder, we have 2 files:<br/>
> - default.json<br/>
> - custom-environment-variables.json <br/>


>In the user model, we do the following:<br/>
>1. Create a mongoose schema
>2. Create a model with the schema
>3. We validate the user inputs with Joi
>4. Return the User model & the validateUser method
>5. Create a method to generate the authentication token in the userSchema.<br/>
>`userSchema.methods.generateAuthenticationToken = function () {`<br/>
>  `const token = jwt.sign(`<br/>
>    `{`<br/>
>     ` _id: this._id,`<br/>
>   `   email: this.email,`<br/>
>   ` },`<br/>
>  `  config.get("jwtPrivateKey")`<br/>
>  `);`<br/>
> ` return token;`<br/>
>`};`<br/>
><br/>
>After creating the user model, we move to creating routes. In our application we need just 2 routes. <br/>
>- `POST /api/users` - to create new user
>- `POST /api/auth` - for the users to login to the system <br/>

**Create New User**
>1. Validate the user. If the request body contains all those fields we wanted.<br/>
>` const { error } = validateUser(req.body);`
>`if (error) return res.status(400).send(error.details[0].message);`
>2. Check if the email is already registered. If yes, return an ERROR <br/>
>`const { firstName, lastName, email, password } = req.body;`<br/>
>    `let user = await User.findOne({ email: email });`<br/>
>    `if (user) return res.status(400).send("User already registered");`<br/>
> 3. Create the user and save it in the database. We don't intend to save the password as a plain text. Therefore we hash them with the bcrypt package.<br/>
> `user = new User({`<br/>
>      `firstName,`<br/>
>      `lastName,`<br/>
>      `email,`<br/>
>     ` password,`<br/>
>   ` });`<br/>
><br/>
>   `const salt = await bcrypt.genSalt(10);`<br/>
>   `user.password = await bcrypt.hash(user.password, salt);`<br/>
>   `const result = await user.save();`<br/>
>4. Generate the authentication token and send it to the user <br/>
>`const token = user.generateAuthenticationToken();`<br/>
>    `return res`<br/>
>     ` .status(200)` <br/>
>     `.send(_.pick(result, ["_id", "email", "firstName", "lastName"]));`<br/>


**Authenticating the users**
>1. Validate the user body<br/>
>  `const { error } = validateUser(req.body);`<br/>
>    `if (error) return res.status(400).send(error.details[0].message);`<br/>
> 2. Check if the user is a registered one.<br/>
>  `const { email, password } = req.body;`<br/>
>    `let user = await User.findOne({ email });`<br/>
>    `if (!user) return res.status(400).send("Invalid email or password");`<br/>
> 3. Check for the password.<br/>
>  `const isValidPassword = await bcrypt.compare(password, user.password);`<br/>
>   ` if (!isValidPassword)`<br/>
>      `return res.status(400).send("Invalid email or password");`<br/>
> 4. Set the header<br/>
> `const token = user.generateAuthenticationToken();`<br/>
>    `return res`<br/>
>      `.status(200)`<br/>
>      `.header("x-auth-token", token)`<br/>
>      `.send(``${user.email} Successfully logged in! token:${token}``);`<br/>
> **NOTE** : We should be implementing the validateUser inside this.<br/>
> `function validateUser(user) {`<br/>
>  `const schema = Joi.object({`<br/>
>    `email: Joi.string()`<br/>
>     ` .email({ tlds: { allow: false } })`<br/>
>      `.required()`<br/>
>   `   .label("Email address"),`<br/>
> `   password: Joi.string().required().label("Password").min(5),`<br/>
>  `});`<br/>
>  `return schema.validate(user);`<br/>
>`}`<br/>

>**NOTE** We should make sure that the jwtPrivateKey is set in the index file. <br/>
>`if (!config.get("jwtPrivateKey")) {`<br/>
>  `console.log("FATAL ERROR!! jwtPrivateKey is not set");`<br/>
>  `process.exit(1);`<br/>
>`}`<br/>