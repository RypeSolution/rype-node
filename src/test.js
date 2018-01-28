const models = require('./models')

models.sequelize.sync()
    .then(() => {
      models.User.create(userData)
          .then(user => {
              let userJson = user.get({
                  plain: true
              })
              res.json(userJson)
          })
          .catch(error => {
              res.json({error})
          })
        console.log(models.RentItems)
    })
