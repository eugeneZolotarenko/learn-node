exports.getLogin = async (req, res, next) => {
  try {
    await res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      isAuthenticated: false,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.postLogin = async (req, res, next) => {
  try {
    req.session.isLoggedIn = true
    await res.redirect("/")
  } catch (err) {
    console.log(err)
  }
}

exports.postLogout = async (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err)
    res.redirect("/")
  })
}
