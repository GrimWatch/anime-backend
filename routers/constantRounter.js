const express = require("express");

const router =express.Router();
const constantController=require("../controllers/constantController");

router
.route("/getGenres")
.get(constantController.getGenre);

router
.route("/getYear")
.get(constantController.getYear);

router
.route("/getStatus")
.get(constantController.getStatus);

router
.route("/getType")
.get(constantController.getType);

router
.route("/getLanguages")
.get(constantController.getLanguages);

router
.route("/getCountry")
.get(constantController.getCountry);


router
.route("/getSeason")
.get(constantController.getSeason);
router

.route("/getOrder")
.get(constantController.getOrder);


module.exports=router;