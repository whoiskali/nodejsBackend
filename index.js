const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
// var bodyParser = require('body-parser')

const prisma = new PrismaClient();
var express = require("express");
const jwt = require("jsonwebtoken");
var app = express();

const auth = require("./middleware/auth");
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
// app.use(bodyParser.json())

async function hash(password) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
}

async function compare(password, hashed) {
  const match = await bcrypt.compare(password, hashed);
  return match;
}

// var user = prisma.profiles.create({data:{

// }});

app.post("/api/createProfile", auth, async (req, res) => {
  //   console.log(req.body);
  password = await hash(req.body.password);
  try {
    await prisma.profiles.create({
      data: {
        firstName: req.body.firstName,
        address: req.body.address,
        email: req.body.email,
        lastName: req.body.lastName,
        password: password,
        phoneNumber: req.body.phoneNumber,
        postCopde: req.body.postCopde,
        userName: req.body.userName,
      },
    });
    res.send("Added successfully");
  } catch (e) {
    res.status(400).send("Username already exist.");
    return;
  }
});

app.get("/api/getProfiles", auth, async (req, res) => {
  res.send(await prisma.profiles.findMany());
});

app.get("/api/getProfile/:id", async (req, res) => {
  try {
    var profile = await prisma.profiles.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    if (profile == null) res.status(404).send("No profile found");
  } catch (e) {
    res.status(400).send(e.message);
    return;
  }
  res.send(profile);
});

app.delete("/api/deleteProfile/:id", auth, async (req, res) => {
  try {
    var profile = await prisma.profiles.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    if (profile == null) res.status(404).send("No profile found");
    var deleteProfile = prisma.profiles.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    const transaction = await prisma.$transaction([deleteProfile]);
    res.send("Delete successfully");
  } catch (e) {
    res.status(400).send(e.message);
    return;
  }
});

app.put("/api/editProfile/:id", auth, async (req, res) => {
  try {
    var profile = await prisma.profiles.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    if (profile == null) res.status(404).send("No profile found");

    password = await hash(req.body.password);

    (profile.firstName = req.body.firstName),
      (profile.address = req.body.address),
      (profile.email = req.body.email),
      (profile.lastName = req.body.lastName),
      (password = await hash(req.body.password));
    (profile.password = password),
      (profile.phoneNumber = req.body.phoneNumber),
      (profile.postCopde = req.body.postCopde),
      (profile.userName = req.body.userName),
      await prisma.profiles.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: profile,
      });
    res.send(profile);
  } catch (e) {
    res.status(400).send(e.message);
    return;
  }
});

app.post("/api/login", async (req, res) => {
    
  try{
    const { username, password } = req.body;
    
    if (!(username && password)) {
      res.status(400).send("All input is required");
    }
  
    var profile = await prisma.profiles.findUnique({
        where: {
            userName: username
        }
    })
    
    if (profile && (await compare(password, profile.password))) {
    //   console.log(process.env.JwtTokenKey)
      var token = jwt.sign({
          id: profile.id,
        userName: username
      }, process.env.JwtTokenKey, { expiresIn: 60 * 60 });
      console.log(profile)
  
      
  
      // user
      res.status(200).json({token: token});
    }
  }catch(e){
    res.status(400).send(e);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));
