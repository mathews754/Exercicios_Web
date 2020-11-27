<template>
  <div id="app-body">
    <h1 id="welcome-title">Consumindo a API</h1>
    <section class="input">
      <button id="btn-load" v-on:click="loadUsers">Carregar dados</button>
      <div class="input-name">
        <label>Nome do usuário</label>
        <input type="text" v-model="input_name" placeholder="Digite o nome aqui...">
      </div>
      <div class="input-date">
        <label >Data de Nascimento do usuário</label>
        <input type="date" v-model="input_date">
      </div>
      <button id="btn-send" v-on:click="sendUser">Enviar</button>
      <button id="btn-clear" v-on:click="cleanInput">Limpar</button>
    </section>
    <table id="table">
      <thead id="table-columns">
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Nascimento</th>
        </tr>
      </thead>
      <tbody id="table-data" v-for="user in usuarios" v-bind:key="user.id">
        <tr>
          <th scope="row">{{user.id}}</th>
          <td>{{user.nome}}</td>
          <td>{{user.data_nasc}}</td>
          <td><button v-on:click="editUser(user)">Editar</button></td>
          <td><button v-on:click="deleteUser(user)">Deletar</button></td>
        </tr>
      </tbody>
    </table>
  </div>
  
</template>

<script>
import axios from 'axios';
const api = axios.create({
  baseURL: "http://localhost:5000",
});

export default {
  data: function(){ 
    return {
    usuarios: [],
    last_id: -1,
    input_name: "",
    input_date: "",
    is_edit_input: false,
    cur_user: {}
  }},
  methods: {
    async loadUsers(){
      const users = await api.get("/users");
      this.usuarios = []
      for (const user of users.data){
        this.usuarios.push({ id: user.id, nome: user.nome, data_nasc: user.nascimento, created_at: user.created_at, updated_at: user.updated_at });
        if (user.id > this.last_id) this.last_id = parseInt(user.id);
      }
    },
    async sendUser(){
      if (this.last_id == -1) await this.loadUsers();
      if (this.input_name == "" || this.input_date == "") {
        alert("Preencha todos os campos antes de enviar!");
        return;
      }
      if (this.is_edit_input){
        const newUser = {
          id: this.cur_user.id,
          nome: this.input_name,
          nascimento: this.input_date,
        }
        const response = await api.put(`/users/${newUser.user_id}`, newUser);
        if (response.status == 200){
          alert("Edição feita com sucesso!");
        }
        this.loadUsers();
      }
      else {
        const newUser = {
          id: (this.last_id + 1).toString(),
          nome: this.input_name,
          nascimento: this.input_date,
        }
        const response = await api.post(`/users`, newUser);
        if (response.status == 201){
          alert("Novo usuário cadastrado com sucesso!");
        }
        this.loadUsers();
      }
    },
    async deleteUser(user){
      const response = await api.delete(`/users/${user.id}`);
      if ((await response).status == 204){
        alert("Usuários deletado com sucesso!");
      }
      this.loadUsers();
    },
    editUser(user){
      this.is_edit_input = true;
      this.input_name = user.nome;
      this.input_date = user.data_nasc;
      this.cur_user = user;
    },
    cleanInput(){
      this.input_name = "";
      this.input_date = "";
      this.is_edit_input = false;
      this.cur_user = {};
    },
    getDateNow(){
      const curDate = new Date(Date.now());
      return `${curDate.getFullYear()}-${curDate.getMonth()+1}-${curDate.getDate()}`
    }
  }
}
</script>

<style>
*{ margin: 0;}

#app, #app-body{
  display: flex;
  flex-direction: column;
  align-items: center;
}

#welcome-title {
  margin: 10px;
  text-align: center;
}

.input{
  margin: 15px;
}

.input button{
  margin: 10px 0px;
}

.input div{
  width: 60vw;
  margin-bottom: 10px;
}

.input label{
  display: block;
  font-size: 14px;
}

.input-name input{
  width: 300px;
}

.input-date input{
  width: 150px;
}

#btn-send{
  margin-right: 10px;
}

#table{
  width: 70vw;
  background-color: #eee;
}

#table *{
  font-size: 17px;
}

#table-columns th, #table-data th{
  text-align: left;
}

#table-data tr:nth-of-type(odd){
  background-color: #ddd;
}
</style>