const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const request = require('request');
const https = require('https');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');

const app = express();

const indexStartingContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tempor orci dapibus ultrices in. Tempus egestas sed sed risus pretium quam vulputate dignissim suspendisse. Posuere ac ut consequat semper viverra. Et ligula ullamcorper malesuada proin libero nunc consequat interdum varius. Placerat vestibulum lectus mauris ultrices eros in cursus turpis. Fames ac turpis egestas maecenas pharetra convallis posuere morbi. Urna neque viverra justo nec ultrices dui sapien eget mi. Neque gravida in fermentum et sollicitudin ac orci phasellus egestas. Sed lectus vestibulum mattis ullamcorper velit sed ullamcorper."




app.set('view engine', 'ejs', 'handlebars');

app.engine('handlebars', exphbs());


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(bodyParser.json());



let posts = [];
app.get("/", function(req, res){
        res.render("index", {
        indexStarting: indexStartingContent,
        posts: posts,
        
     });
});


app.get("/compose", function(req, res){
    res.render("compose", {indexStarting: indexStartingContent})
});

app.get("/about", function(req, res){
  res.render("about")
});

app.get("/contact", function(req, res){
  res.render('contact');
});

app.get("/chat", function(req, res){
  res.render('chat');
});


app.post("/compose", function(req, res){
    const post = {
      title: req.body.compose,
      description: req.body.postBody,
      createdAt: new Date().toLocaleDateString()
    };
  
    posts.push(post);
    res.redirect("/");
  
  });

  app.get('/posts/:postName', function (req, res) {
    const requestedTitle = _.lowerCase(req.params.postName);
    
    posts.forEach(function(post){
     const storedTitle = _.lowerCase(post.title);
      const storedContent = post.description;
      
     if (storedTitle === requestedTitle){
  
     
        res.render("post", {
          description: storedContent,
          createdAt: new Date().toLocaleDateString(),
          title: storedTitle
            
        });
     };
    });
  
  });


// Contact Form

app.post('/send', function(req, res){
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
    <li>Name: ${req.body.name}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
    
    </ul>

    <h3>Message</h3>
    <p>${req.body.message}</p>
  
  
  
  
  `;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: 'techproweb.dev@gmail.com',
      pass: 'Lenovoy430.',
    },

    tls: {
      rejectUnauthorized: false
    }



  });

  let mailOptions = {
    from: 'Blog Contact <techproweb.dev@gmail.com>',
    to: "techproecom@gmail.com",
    subject: "Node Contact Form Request",
    html: output
  }

  transporter.sendMail(mailOptions, (err, data) => {
    if(err){
      console.log(err);
      res.status(500).send("something went wrong");
    }else{
      res.render("success")
    }
  });

});

app.listen(3000, function(req, res){
    console.log("Server has started at port 3000");
});