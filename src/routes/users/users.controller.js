async function findAll(req, res) {
  return res.status(200).json({'message': 'Aqui van todos los usuarios'});
}

async function findOne(req, res) {
  return res.status(200).json({'message': 'Aqui se encuentra un usuario'});
}

async function create(req, res) {
  return res.status(200).json({'message': 'Aqui se crean los usuarios'});
}

async function update(req, res) {
  return res.status(200).json({'message': 'Aqui se actualiza un usuario'});
}

async function deleteOne(req, res) {
  return res.status(200).json({'message': 'Aqui de borra un usuario'});
}

module.exports = {
  findAll,
  findOne,
  create,
  update,
  deleteOne
};