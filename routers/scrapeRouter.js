const express = require("express");

const router =express.Router();
const scrapeController=require("../controllers/scrapeController");

router
.route("/getFilterAnime")
.get(scrapeController.getFilterAnime);


router
.route("/getStreamLinks/:id")
.get(scrapeController.getStreamLinks);


router
.route("/getAnimeInfo/:id")
.get(scrapeController.getAnimeInfo);

router
.route("/getAnimeBy")
.get(scrapeController.getAnimeBy);

router
.route("/getGenre")
.get(scrapeController.getGenreAnime);


module.exports=router;
