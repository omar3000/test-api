const { searchHistory, saveHistory } = require('../dbutils.js');
const { v4: uuidv4 } = require('uuid');
const { type } = require('../consts.js');
const { validationResult } = require('express-validator');


async function removeRepeats(req, res) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).send({errors: errors.array()});
    return;
  }

  try{
    
    const resultHistory = await searchHistory(req.body.array.join(','), type.REPEAT,null);
    
    if(resultHistory){
      res.status(200).json(resultHistory.output);
      return;
    }
    const arrayClean = [...new Set(req.body.array)];
    
    await saveHistory({id: uuidv4(), input: req.body.array.join(','), output: arrayClean.join(','), userid: req.userData.userId, type: type.REPEAT});
          
    res.status(200).json(arrayClean.join(','));
  }
  catch(error){
        
    console.log(error);
    res.status(500).send(error);
  }

}

module.exports = { removeRepeats };