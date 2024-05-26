const constants=require("../utils/constants")


exports.getGenre = async (req, res) => {
    try {
        res.json({
            status:"success",
            data:constants.Genre
        })
    } catch (error) {
        
    }
}


exports.getYear = async (req, res) => {
    try {
        res.json({
            data:constants.Year
        })
    } catch (error) {
        
    }
}


exports.getStatus = async (req, res) => {
    try {
        res.json({
            data:constants.Status
        })
    } catch (error) {
        
    }
}

exports.getType = async (req, res) => {
    try {
        res.json({
            data:constants.Type
        })
    } catch (error) {
        
    }
}


exports.getLanguages = async (req, res) => {
    try {
        res.json({
            data:constants.Language
        })
    } catch (error) {
        
    }
}


exports.getCountry = async (req, res) => {
    try {
        res.json({
            data:constants.Country
        })
    } catch (error) {
        
    }
}


exports.getSeason = async (req, res) => {
    try {
        res.json({
            data:constants.Season
        })
    } catch (error) {
        
    }
}


exports.getOrder = async (req, res) => {
    try {
        res.json({
            data:constants.Order
        })
    } catch (error) {
        
    }
}