const express = require("express");
const path = require("path");
const alert = require('alert');
const https = require("https");
const request = require("request");
const bodyParser = require("body-parser");
const app = express();
const port = 3000 || process.env.PORT;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/", (req, res) => {
  const firstName = req.body.first_name;
  const lastName = req.body.last_name;
  const userEmail = req.body.email;
  const phoneNo = req.body.phone_number;
  const message = req.body.content;

  const data = {
    members : [
        {
            email_address : userEmail,
            status : "subscribed",
            merge_fields : {
                FNAME : firstName,
                LNAME : lastName,
                MESSAGE : message,
                PHONE : phoneNo
            }
        }
    ]
};

  const jsonData = JSON.stringify(data);

  const url = "https://us17.api.mailchimp.com/3.0/lists/fb8e885816";
  const option = {
    method: "POST",
    auth: "Abhay:a1057a910d843aa3708ab85b7dfcdd21-us17",
  };

  const requests = https.request(url, option, (response) => {
    if (response.statusCode === 200) {
         res.redirect("/#contact");
         console.log("Succuessfully Submitted !!");
    } else {
         res.sendFile(path.join(__dirname , "error.html"));
         console.log("Something Went Worng, Try Again !!");
    }

    response.on("data", (data) => {
      console.log("Exited");
    });
  });

  requests.write(jsonData);
  requests.end();

});

app.listen(port, () => {
  // console.log(`Staring on http://localhost:${port}`);
});
