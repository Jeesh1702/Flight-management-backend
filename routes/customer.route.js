import express from "express"

const router = express.Router()

//default route for sign in
router.route("/").get((req,res) => res.send("Sign in/ sign up"))
router.route("/").post()

//routes for dashboard
router.route("/dashboard")
.get((req,res) => res.send("Welcome customer"))
.post()
.put()
.delete()

export default router