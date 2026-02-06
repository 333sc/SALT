const authService = require('../services/auth.service');

const login = (req, res) => {
  const { username, password } = req.body;

  const user = authService.login(username, password);

  if (!user) {
    return res.status(401).json({
      ok: false,
      message: 'Credenciales inválidas'
    });
  }

  res.json({
    ok: true,
    user: {
      id: user.id,
      role: user.role,
      username: user.username
    }
  });
};

module.exports = {
  login
};
