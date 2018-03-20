'use strict'
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const port = process.env.PORT || 3000;
const { mongooseConnect } = require('./db/mongoose.js');

const { client } = require('mongodb');

const { Breeding } = require('./models/breeding.js');

const { Calving } = require('./models/calving.js');

const { CalvingSeason } = require('./models/calving-season.js');

const { Cow } = require('./models/cow.js');

const { Health } = require('./models/health.js');

const { Pasture } = require('./models/pastures.js');

const { PastureMovements } = require('./models/pasture-movements.js');

const { PregCheck } = require('./models/preg-check.js');



let app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/static'));



//  GET ALL DATA FROM CATTLE TABLE
app.get('/:user/cattle', (req, res) => {
  Cow.find({ user: req.params.user })
    // .sort({
    //     tag_id: 1
    //   })
    .then((docs) => {
      res.send(docs)
    }, (err) => {
      res.status(400).send(err);
    });
});


//  GET INDIVIDUAL FROM CATTLE TABLE
app.get('/:user/cattle/:id', (req, res) => {
  Cow.findOne({
      tag_id: req.params.id,
      user: req.params.user
    })
    .then((docs) => {
      res.send(docs)
    }, (err) => {
      res.status(400).send(err);
    });
});
//  GET INDIVIDUAL FROM CATTLE TABLE

//  POST TO CATTLE TABLE
app.post('/:user/cattle', (req, res) => {
  // console.log(req);
  let newCow = new Cow({
    tag_id: req.body.tag_id,
    user: req.body.user,
    type: req.body.type,
    dob: req.body.dob,
    pasture: req.body.pasture,
    sire: req.body.sire,
    dam: req.body.dam
  });
  newCow.save()
    .then((doc) => {
      res.send(doc);
    }, (err) => {
      res.status(400).send(err);
    });
});
//  POST TO CATTLE TABLE

//DELETE ANIMAL BY ID
app.delete('/:user/cattle/:id', (req, res) => {
  // console.log("deleterequest" + JSON.stringify(req.params));
  Cow.findOneAndRemove({
      tag_id: req.params.id,
      user: req.params.user
    })
    .then((docs) => {
      if (!docs) {
        res.send('Nothing found');
        return;
      }
      res.send(docs);
    }, (err) => {
      res.status(400).send(err.message);
    });
});
////DELETE ANIMAL BY ID

//  UPDATE ANIMAL BY TAG ID
app.patch('/:user/cattle/:id', (req, res) => {
  Cow.findOneAndUpdate({
      tag_id: req.params.id,
      user: req.params.user
    }, {
      $set: req.body
    }, {
      new: true,
      runValidators: true
    })
    .then((response) => {
      if (!response) {
        res.send('Nothing found');
        return;
      }
      res.send(response);
    }, (err) => {
      res.status(400).send(err.message);
    });
});
//  UPDATE ANIMAL BY TAG ID

//  GET ALL DATA FROM BREEDING TABLE
app.get('/:user/breeding', (req, res) => {
  Breeding.find({ user: req.params.user }).sort({ date: -1 })
    .then((docs) => {
      res.send(docs)
    }, (err) => {
      res.status(400).send(err);
    });
});
//  GET ALL DATA FROM BREEDING TABLE

//  GET INDIVIDUAL COW BREEDING DATA BY TAG-ID
app.get('/:user/breeding/:id', (req, res) => {
  Breeding.find({ tag_id: req.params.id, user: req.params.user })
    .sort({ date: -1 })
    .then((docs) => {
      res.send(docs)
    }, (err) => {
      res.status(400).send(err);
    });
});
//  GET INDIVIDUAL COW BREEDING DATA BY TAG-ID

//  GET INDIVIDUAL BREEDING EVENT DATA BY OBJECT ID
app.get('/:user/breedingevent/:id', (req, res) => {
  Breeding.findById(req.params.id)
    .then((docs) => {
      res.send(docs)
    }, (err) => {
      res.status(400).send(err);
    });
});
//  GET INDIVIDUAL COW BREEDING DATA BY OBJECT ID

//  POST TO BREEDING TABLE
app.post('/:user/breeding', (req, res) => {
  let newBreeding = new Breeding({
    tag_id: req.body.tag_id,
    user: req.body.user,
    date: req.body.date,
    method: req.body.method,
    sire: req.body.sire,
    technician: req.body.technician,
    comments: req.body.comments
  });
  newBreeding.save()
    .then((doc) => {
      // console.log(doc);
      res.send(doc);
    }, (err) => {
      res.status(400).send(err);
    });
});
//  POST TO BREEDING TABLE

//DELETE BREEDING DOCUMENT BY ID
app.delete('/:user/breedingevent/:id', (req, res) => {
  Breeding.findByIdAndRemove(req.params.id)
    .then((docs) => {
      if (!docs) {
        res.send('Nothing found');
        return;
      }
      res.send(docs);
    }, (err) => {
      res.status(400).send(err.message);
    });
});
////DELETE BREEDING DOCUMENT BY ID

//UPDATE BREEDING DOCUMENT BY ID
app.patch('/:user/breedingevent/:id', (req, res) => {
  Breeding.findOneAndUpdate({
      _id: req.params.id
    }, {
      $set: req.body
    }, {
      new: true,
      runValidators: true
    })
    .then((response) => {
      if (!response) {
        res.send('Nothing found');
        return;
      }
      res.send(response);
    }, (err) => {
      res.status(400).send(err.message);
    });
});
//UPDATE BREEDING DOCUMENT BY ID

//  GET ALL DATA FROM CALVING TABLE
app.get('/:user/calving', (req, res) => {
  Calving.find({ user: req.params.user })
    .sort({ dob: -1 })
    .then((docs) => {
      res.send(docs)

    }, (err) => {
      res.status(400).send(err);
    });
});
//  GET ALL DATA FROM CALVING TABLE

//  GET INDIVIDUAL COW CALVING DATA BY TAG-ID
app.get('/:user/calving/:id', (req, res) => {
  Calving.find({
      tag_id: req.params.id,
      user: req.params.user
    }).sort({ dob: -1 })
    .then((docs) => {
      res.send(docs)

    }, (err) => {
      res.status(400).send(err);
    });
});
//  GET INDIVIDUAL COW CALVING DATA BY TAG-ID

//  GET INDIVIDUAL CALVING EVENT DATA BY OBJECT ID
app.get('/:user/calvingevent/:id', (req, res) => {
  Calving.findById(req.params.id)
    .then((docs) => {
      res.send(docs)

    }, (err) => {
      res.status(400).send(err);
    });
});
//  GET INDIVIDUAL COW CALVING DATA BY OBJECT ID

//  POST TO CALVING TABLE
app.post('/:user/calving', (req, res) => {
  let newCalving = new Calving({
    tag_id: req.body.tag_id,
    user: req.body.user,
    calf_id: req.body.calf_id,
    season: req.body.season,
    dob: req.body.dob,
    sex: req.body.sex,
    sire: req.body.sire,
    comments: req.body.comments
  });
  newCalving.save()
    .then((doc) => {
      res.send(doc);
    }, (err) => {
      res.status(400).send(err);
    });
});
//  POST TO CALVING TABLE

//DELETE CALVING DOCUMENT BY ID
app.delete('/:user/calvingevent/:id', (req, res) => {
  Calving.findByIdAndRemove(req.params.id)
    .then((docs) => {
      if (!docs) {
        res.send('Nothing found');
        return;
      }
      res.send(docs);
    }, (err) => {
      res.status(400).send(err.message);
    });
});
////DELETE CALVING DOCUMENT BY ID

//UPDATE CALVING DOCUMENT BY ID
app.patch('/:user/calvingevent/:id', (req, res) => {
  Calving.findOneAndUpdate({
      _id: req.params.id
    }, {
      $set: req.body
    }, {
      new: true,
      runValidators: true
    })
    .then((response) => {
      if (!response) {
        res.send('Nothing found');
        return;
      }
      res.send(response);
    }, (err) => {
      res.status(400).send(err.message);
    });
});
//UPDATE CALVING DOCUMENT BY ID

//  GET ALL DATA FROM HEALTH TABLE
app.get('/:user/health', (req, res) => {
  Health.find({ user: req.params.user })
    .sort({ treatmentDate: -1 })
    .then((docs) => {
      res.send(docs)
    }, (err) => {
      res.status(400).send(err);
    });
});
//  GET ALL DATA FROM HEALTH TABLE

// GET ALL DATA FROM CALVING SEASON TABLE
app.get('/:user/calving-season', (req, res) => {
  CalvingSeason.find({ user: req.params.user }).sort({ dateCreated: -1 })
    .then((docs) => {
      res.send(docs)
    }, (err) => {
      res.status(400).send(err);
    });
});
// GET ALL DATA FROM CALVING SEASON TABLE

//  GET INDIVIDUAL CALVING SEASON DATA BY OBJECT ID
app.get('/:user/calving-season/:id', (req, res) => {
  CalvingSeason.findById(req.params.id)
    .sort({ dateCreated: -1 })
    .then((docs) => {
      res.send(docs)
    }, (err) => {
      res.status(400).send(err);
    });
});
//  GET INDIVIDUAL CALVING SEASON BY OBJECT ID

// POST TO CALVING SEASON TABLE
app.post('/:user/calving-season', (req, res) => {
  let newCalvingSeason = new CalvingSeason({
    user: req.body.user,
    name: req.body.name,
    comments: req.body.comments
  });
  newCalvingSeason.save()
    .then((doc) => {
      res.send(doc);
    }, (err) => {
      res.status(400).send(err);
    });
});
// POST TO CALVING SEASON TABLE

//DELETE CALVING SEASON DOCUMENT BY ID
app.delete('/:user/calving-season/:id', (req, res) => {
  CalvingSeason.findByIdAndRemove(req.params.id)
    .then((docs) => {
      if (!docs) {
        res.send('Nothing found');
      }
      res.send(docs);
    }, (err) => {
      res.status(400).send(err.message);
    });
});
////DELETE CALVING SEASON DOCUMENT BY ID

//UPDATE CALVING SEASON DOCUMENT BY ID
app.patch('/:user/calving-season/:id', (req, res) => {
  CalvingSeason.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, {
      new: true,
      runValidators: true
    })
    .then((response) => {
      if (!response) {
        res.send('Nothing found');
      }
      res.send(response);
    }, (err) => {
      res.status(400).send(err.message);
    });
});
//UPDATE CALVING SEASON DOCUMENT BY ID

//  GET INDIVIDUAL COW HEALTH DATA
app.get('/:user/health/:id', (req, res) => {
  Health.find({
      tag_id: req.params.id,
      user: req.params.user
    })
    .sort({ treatmentDate: -1 })
    .then((docs) => {
      res.send(docs)

    }, (err) => {
      res.status(400).send(err);
    });
});
//  GET INDIVIDUAL COW HEALTH DATA

//  GET INDIVIDUAL HEALTH EVENT DATA BY OBJECT ID
app.get('/:user/healthevent/:id', (req, res) => {
  Health.findById(req.params.id)
    .then((docs) => {
      res.send(docs)

    }, (err) => {
      res.status(400).send(err);
    });
});
//  GET INDIVIDUAL COW HEALTH DATA BY OBJECT ID

//  POST TO HEALTH TABLE
app.post('/:user/health', (req, res) => {
  let newHealth = new Health({
    tag_id: req.body.tag_id,
    user: req.body.user,
    treatmentDate: req.body.treatmentDate,
    medication: req.body.medication,
    dosage: req.body.dosage,
    booster: req.body.booster,
    diagnosis: req.body.diagnosis,
    comments: req.body.comments
  });
  newHealth.save()
    .then((doc) => {
      res.send(doc);
    }, (err) => {
      res.status(400).send(err);
    });
});
//  POST TO HEALTH TABLE

//DELETE HEALTH DOCUMENT BY ID
app.delete('/:user/healthevent/:id', (req, res) => {
  Health.findByIdAndRemove(req.params.id)
    .then((docs) => {
      if (!docs) {
        res.send('Nothing found');
        return;
      }
      res.send(docs);
    }, (err) => {
      res.status(400).send(err.message);
    });
});
////DELETE HEALTH DOCUMENT BY ID

//UPDATE HEALTH DOCUMENT BY ID
app.patch('/:user/healthevent/:id', (req, res) => {
  Health.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, {
      new: true,
      runValidators: true
    })
    .then((response) => {
      if (!response) {
        res.send('Nothing found');
        return;
      }
      res.send(response);
    }, (err) => {
      res.status(400).send(err.message);
    });
});
//UPDATE HEALTH DOCUMENT BY ID


// GET ALL DATA FROM PASTURES TABLE
app.get('/:user/pastures', (req, res) => {
  Pasture.find({ user: req.params.user }).sort({ name: 1 })
    .then((docs) => {
      res.send(docs)
    }, (err) => {
      res.status(400).send(err);
    });
});
// GET ALL DATA FROM PASTURES TABLE

//  GET INDIVIDUAL PASTURE DATA BY OBJECT ID
app.get('/:user/pastures/:id', (req, res) => {
  Pasture.findById(req.params.id)
    .sort({ name: 1 })
    .then((docs) => {
      res.send(docs)

    }, (err) => {
      res.status(400).send(err);
    });
});
//  GET INDIVIDUAL PASTURE BY OBJECT ID

// POST TO PASTURES TABLE
app.post('/:user/pastures', (req, res) => {
  let newPasture = new Pasture({
    user: req.body.user,
    name: req.body.name,
    comments: req.body.comments
  });
  newPasture.save()
    .then((doc) => {
      res.send(doc);
    }, (err) => {
      res.status(400).send(err);
    });
});
// POST TO PASTURES TABLE

//DELETE PASTURE DOCUMENT BY ID
app.delete('/:user/pastures/:id', (req, res) => {
  Pasture.findByIdAndRemove(req.params.id)
    .then((docs) => {
      if (!docs) {
        res.send('Nothing found');
        return;
      }
      res.send(docs);
    }, (err) => {
      res.status(400).send(err.message);
    });
});
////DELETE PASTURE DOCUMENT BY ID

//UPDATE PASTURE DOCUMENT BY ID
app.patch('/:user/pastures/:id', (req, res) => {
  Pasture.findOneAndUpdate({
      _id: req.params.id
    }, {
      $set: req.body
    }, {
      new: true,
      runValidators: true
    })
    .then((response) => {
      if (!response) {
        res.send('Nothing found');
        return;
      }
      res.send(response);
    }, (err) => {
      res.status(400).send(err.message);
    });
});
//UPDATE PASTURE DOCUMENT BY ID

//  GET ALL DATA FROM PASTURE MOVEMENTS TABLE
app.get('/:user/movements', (req, res) => {
  PastureMovements.find({ user: req.params.user })
    .sort({ dateMoved: -1 })
    .then((docs) => {
      res.send(docs)
    }, (err) => {
      res.status(400).send(err);
    });
});
//  GET ALL DATA FROM PASTURE MOVEMENTS TABLE

//  GET INDIVIDUAL PASTURE MOVEMENTS DATA BY TAG-ID
app.get('/:user/movement/:id', (req, res) => {
  PastureMovements.find({ tag_id: req.params.id, user: req.params.user })
    .sort({ dateMoved: -1 })
    //
    .then((docs) => {
      res.send(docs)
    }, (err) => {
      res.status(400).send(err);
    });
});
//  GET INDIVIDUAL PASTURE MOVEMENTS DATA BY TAG-ID

//  GET INDIVIDUAL PASTURE MOVEMENTS DATA BY OBJECT ID
app.get('/:user/movements/:id', (req, res) => {
  PastureMovements.findById(req.params.id)
    .then((docs) => {
      res.send(docs)
    }, (err) => {
      res.status(400).send(err);
    });
});
//  GET INDIVIDUAL PASTURE MOVEMENTS DATA BY OBJECT ID

//  POST TO PASTURE MOVEMENTS TABLE
app.post('/:user/movements', (req, res) => {
  // console.log(req);
  let newPastureMovement = new PastureMovements({
    user: req.body.user,
    tag_id: req.body.tag_id,
    dateMoved: req.body.dateMoved,
    name: req.body.name,
    comments: req.body.comments
  });
  newPastureMovement.save()
    .then((doc) => {
      res.send(doc);
    }, (err) => {
      res.status(400).send(err);
    });
});
//  POST TO PASTURE MOVEMENTS TABLE

//DELETE PASTURE MOVEMENTS BY ID
app.delete('/:user/movements/:id', (req, res) => {
  PastureMovements.findByIdAndRemove(req.params.id)
    .then((docs) => {
      if (!docs) {
        res.send('Nothing found');
        return;
      }
      res.send(docs);
    }, (err) => {
      res.status(400).send(err.message);
    });
});
////DELETE PASTURE MOVEMENTS BY ID

//UPDATE PASTURE MOVEMENTS BY ID
app.patch('/:user/movements/:id', (req, res) => {
  PastureMovements.findOneAndUpdate({
      _id: req.params.id
    }, {
      $set: req.body
    }, {
      new: true,
      runValidators: true
    })
    .then((response) => {
      if (!response) {
        res.send('Nothing found');
        return;
      }
      res.send(response);
    }, (err) => {
      res.status(400).send(err.message);
    });
});
//UPDATE PASTURE MOVEMENTS BY ID


//  GET ALL DATA FROM PREG-CHECK TABLE
app.get('/:user/pregnancy', (req, res) => {
  PregCheck.find({ user: req.params.user }).sort({ date: -1 })
    .then((docs) => {
      res.send(docs)
    }, (err) => {
      res.status(400).send(err);
    });
});
//  GET ALL DATA FROM PREG-CHECK TABLE

//  GET INDIVIDUAL COW PREG-CHECK DATA
app.get('/:user/pregnancy/:id', (req, res) => {
  PregCheck.find({
      tag_id: req.params.id,
      user: req.params.user
    })
    .sort({ date: -1 })
    .then((docs) => {
      res.send(docs)
    }, (err) => {
      res.status(400).send(err);
    });
});
//  GET INDIVIDUAL COW PREG-CHECK DATA

//  GET INDIVIDUAL COW PREG-CHECK DATA BY OBJECT ID
app.get('/:user/pregcheck/:id', (req, res) => {
  PregCheck.findById(req.params.id)
    .then((docs) => {
      res.send(docs)
    }, (err) => {
      res.status(400).send(err);
    });
});
//  GET INDIVIDUAL COW PREG-CHECK DATA BY OBJECT ID

//  POST TO PREG-CHECK TABLE
app.post('/:user/pregnancy', (req, res) => {
  let newPregCheck = new PregCheck({
    tag_id: req.body.tag_id,
    user: req.body.user,
    date: req.body.date,
    method: req.body.method,
    result: req.body.result,
    comments: req.body.comments
  });
  newPregCheck.save()
    .then((doc) => {
      res.send(doc);
    }, (err) => {
      res.status(400).send(err);
    });
});
//  POST TO PREG-CHECK TABLE

//DELETE PREG-CHECK DOCUMENT BY ID
app.delete('/:user/pregnancy/:id', (req, res) => {
  PregCheck.findByIdAndRemove(req.params.id)
    .then((docs) => {
      if (!docs) {
        res.send('Nothing found');
        return;
      }
      res.send(docs);
    }, (err) => {
      res.status(400).send(err.message);
    });
});
////DELETE PREG-CHECK DOCUMENT BY ID

//UPDATE PREG-CHECK DOCUMENT BY ID
app.patch('/:user/pregnancy/:id', (req, res) => {
  PregCheck.findOneAndUpdate({
      _id: req.params.id
    }, {
      $set: req.body
    }, {
      new: true,
      runValidators: true
    })
    .then((response) => {
      if (!response) {
        res.send('Nothing found');
        return;
      }
      res.send(response);
    }, (err) => {
      res.status(400).send(err.message);
    });
});
//UPDATE PREG-CHECK DOCUMENT BY ID


app.listen(port, () => {
  console.log('listening on port 3000');
});