const express = require('express');
app = express();
const exhbs = require('express-handlebars');
const mongoose = require('mongoose');
const admin = require("firebase-admin");
var serviceAccount = require("./data/service_account.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ba-test-4.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("companies");

// var db = admin.database();
// var ref = db.ref("/companies");
// let URL = "mongodb://localhost:27017/sodra";

// mongoose.connect(URL, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true
// }, (err, db) => {
//     if (err) throw err;

//     console.log('MongoDB connected');
//     // console.log(db.collections.companies)
// });

app.engine('handlebars', exhbs());
app.set('view engine', 'handlebars')

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))


// Load model

let Company = require('./model/Company')


async function loadFromDataBase() {
    let companies = await Company.find();
    return companies;
}


app.get('', async (req, res) => {
    res.render('search')
})

app.get('/search', async (req, res) => {
    let keyword = req.query.keyword.trim();
    let category = req.query.category;
    // let query = {};

    // query[category] = keyword;|| category === 'avgWage' || category === 'numInsured'
    if (category === 'code' && !isNaN(keyword)) {

        ref.orderByChild("code").equalTo(parseInt(keyword)).limitToLast(1).once('value', function (snapshot) {
            let record = snapshot.val();
            if (record != null) {
                res.json({
                    status: 'success',
                    result: snapshot.val()
                })

            } else {
                res.json({
                    status: 'fail',
                    result: 'no record found'
                })
            }

        })
        // ref.orderByChild('code').equalTo(keyword).on("value", (snapshot) => {
        //     console.log(snapshot.val());
        //     snapshot.forEach(function (data) {
        //         console.log(data.key);
        //     });
        // })
        // query[category] = parseInt(keyword)

    } else {
        res.json({
            status: 'fail',
            result: 'Wrong search details'

        })
        // ref.orderByChild("name").equalTo()(keyword).limitToLast(1).once('value', function (snapshot) {
        //     res.json({
        //         status: 'success',
        //         result: snapshot.val()
        //     })

        // })

        // ref.orderByChild('name').equalTo(keyword).on("value", (snapshot) => {
        //     console.log(snapshot.val());
        //     snapshot.forEach(function (data) {
        //         console.log(data.key);
        //     });
        // })

        // if (category === 'name' && isNaN(keyword)) {
        //     query[category] = {
        //         $regex: `${keyword}`,
        //         $options: "i"
        //     };
        // } else {
        //     query = null;
        // }

        // }

        // if (query == null) {
        //     res.json({
        //         status: 'fail',
        //         result: {
        //             value: 'Wrong search details'
        //         }
        //     })
        // } else {
        //     let value = await Company.find(query);

        //     console.log(query)
        //     console.log(value.length);
        //     if (value.length >= 1) {
        //         res.json({
        //             status: 'success',
        //             result: value
        //         })
        //     } else {
        //         res.json({
        //             status: 'fail',
        //             result: {
        //                 value: 'not found'
        //             }
        //         })
        //     }
    }


})

let PORT = 3000 || process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})