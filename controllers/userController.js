const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");





module.exports = {
  //-------------------------------------------------------------------------------------------------
  // RENDING PAGES



  // User home page
  home: (req, res) => {
    // res.send("You just created a User ...!!!");
    if (req.session.userLogin) {
      res.render("user/home", { login: true, user: req.session.user });
    } else {
      res.render('user/home', { login: false });
    }
  },

  // User signin page
  signin: (req, res) => {
    if (!req.session.userLogin) {
      res.render('user/signin');
    } else {
      res.redirect('/')
    }
  },



  //-------------------------------------------------------------------------------------------------
  // REDIRECTING PAGES



  //signup
  signup: async (req, res) => {
   
    const newUser = UserModel(req.body
      //   {
      //   fullName: req.body.fullName,
      //   userName: req.body.userName,
      //   email: req.body.email,
      //   phone: req.body.phone,
      //   password: req.body.password
      // }
    );
    console.log(req.body);
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(() => {
            res.redirect("/signin");
          })
          .catch((err) => {
            console.log(err);
            res.redirect("/signin")
          })
      })
    })
  },

  //signin
  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({$and:[{email : email}, { status : "Unblocked"}] });
    if (!user) {
      return res.redirect('/signin');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect('/signin');
    }
    req.session.user = user.userName
    req.session.userLogin = true;
    res.render('user/home', { login: true, user: user.userName });
  },





  //-------------------------------------------------------------------------
  // LOG OUT



  logout: (req, res) => {
    req.session.loggedOut = true;
    // if(req.session.loggedOut){
    req.session.destroy()
    res.redirect('/')
    // }
  }

};
