import express from "express"

const router = express.Router()

router.route("/").get((req,res) => res.send("Hello world"))
router.route("/").post()

export default router