const { Router } = require('express')
const router = Router()
const admin = require('firebase-admin')

var serviceAccount = require("../../firebasePermission.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "databaseURL"
})
const db = admin.firestore()

router.get('/', (req, res) => {
    return res.status(200).send('Hello World!')
})

/**
 * Creates an user in Firestore
 */
router.post('/create-user', async (req, res) => {
    try {
        await db.collection('users').doc().create(req.body)
        return res.status(200).json()
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})

/**
 * Get all the users
 */
router.get('/get-users', async (req, res) => {
    try {
        const query = await db.collection('users')
        const querySnapshot = await query.get()
        const response = querySnapshot.docs.map( document => ({
            id: document.id,
            uid: document.data().uid,
            name: document.data().name,
            email: document.data().email,
            phoneNumber: document.data().phoneNumber
        }))
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).send(error)
    }
})

/**
 * Get an user by id
 */
router.get('/get-user/:uid', async (req, res) => {
    try {
        const userId = req.params.uid
        const user =  db.collection('users').doc(userId)
        const data = await user.get()
        if (!data.exists) {
            res.status(404).send('User with the given ID (f' + userId + ') was not found')
        } else {
            res.send(data.data())
        }
    } catch (error) {
        //console.log(error.message);
        return res.status(500).send(error.message)
    }
})

/**
 * Delete an user by id
 */
router.delete("/delete-user/:uid", async (req, res) => {
    try {
        const document = db.collection("users").doc(req.params.uid)
        await document.delete()
        return res.status(200).json()
    } catch (error) {
        return res.status(500).send(error)
    }
})

/**
 * Updates an user name and phone
 */
router.put("/update-user/:uid", async (req, res) => {
    try {
        const document = db.collection("users").doc(req.params.uid)
        await document.update({
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
        })
        return res.status(200).json()
    } catch (error) {
        return res.status(500).json()
    }
})

module.exports = router