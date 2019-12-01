let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CompanySchema = new Schema({
    code: {
        type: Number
    },
    jarCode: {
        type: String
    },
    date: {
        type: Date
    },
    month: {
        type: Number
    },
    name: {
        type: String
    },
    avgWage: {
        type: Number
    },
    avgWage2: {
        type: Number
    },
    numInsured: {
        type: Number
    },
    numInsured2: {
        type: Number
    },
    tax: {
        type: Number
    },
    debt: {
        type: Number
    },
    deferredDebt: {
        type: Number
    },

})

module.exports = mongoose.model('company', CompanySchema)