module.exports = (app) => {
    const get = (req, res) => {
        res.status(200).send(app.users);
    }

    const getById = (req, res) => {
        const userId = req.params.id;
        const posicao = app.users.map(user => user.id).indexOf(userId);

        res.status(200).send(app.users[posicao])
    }

    const post = (req, res) => {
        const fs = require("fs");

        const curDate = new Date(Date.now());
        const createdDate = `${curDate.getFullYear()}-${curDate.getMonth()+1}-${curDate.getDate()}`

        const users = app.users;
        const user = {
            ...req.body,
            created_at: createdDate,
            updated_at: createdDate,
        }
        
        users.push(user)

        const userString = JSON.stringify(users);
        fs.writeFileSync("./users.json", userString);

        res.status(201).send(user);
    }

    const put = (req, res) => {
        const fs = require("fs");
        const user = {...req.body}
        const users = app.users

        const curDate = new Date(Date.now());
        const editDate = `${curDate.getFullYear()}-${curDate.getMonth()+1}-${curDate.getDate()}`

        const posicao = users.map(user => user.id).indexOf(user.id);
        users[posicao] = {
            ...user,
            created_at: users[posicao].created_at,
            updated_at: editDate,
        }
        const userString = JSON.stringify(users);
        fs.writeFileSync("./users.json", userString);

        res.status(200).send(user);
    }

    const remove = (req, res) => {
        const fs = require("fs");
        const userId = req.params.id
        const users = app.users
        
        const newUsers = users.filter((user) => {
            return user.id != userId
        })

        const userString = JSON.stringify(newUsers);
        fs.writeFileSync("./users.json", userString);

        res.status(204).send();
    }

    return {get, getById, post, put, remove}
}