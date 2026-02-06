const users = [
    {
        id: 1,
        username: 'admin',
        password: '1234',
        role: 'admin'
    },
{
    id: 2,
    username: 'instructor',
    password: '1234',
    role: 'instructor'
},
{
    id: 3,
    username: 'aprendiz',
    password: '1234',
    role: 'aprendiz'
},
{
    id: 4,
    username: 'generales',
    password: '1234',
    role: 'generales'
}
];

const login = (username, password) => {
    return users.find(
        u => u.username === username && u.password === password
    );
};

module.exports = {
    login
};
