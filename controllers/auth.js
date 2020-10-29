exports.getLogin = async (req, res, next) => {
  try {
    const isLoggedIn = req.get("Cookie").split("loggedIn=")[1].trim()
    console.log(isLoggedIn)
    await res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      isAuthenticated: isLoggedIn,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.postLogin = async (req, res, next) => {
  try {
    res.setHeader("Set-Cookie", "loggedIn=true")
    await res.redirect("/")
  } catch (err) {
    console.log(err)
  }
}
