<template>
  <div class="register__container">
    <!-- <div class="ui middle aligned center aligned grid">
      <div class="column">
        <h2 class="ui blue image header">
          <div class="content">
            Registrer ny bruger
          </div>
        </h2>
        <form class="ui large form" :class="{'error' : hasErrors }">
          <div class="ui stacked segment">

            <div class="field">
              <div class="ui left icon input">
                <i class="user icon"></i>
                <input type="text" name="name" placeholder="Navn" v-model.trim="name" required>
              </div>
            </div>

            <div class="field">
              <div class="ui left icon input">
                <i class="user icon"></i>
                <input type="text" name="email" placeholder="E-mail" v-model.trim="email" required>
              </div>
            </div>

            <div class="field">
              <div class="ui left icon input">
                <i class="lock icon"></i>
                <input type="password" name="password" placeholder="Password" v-model.trim="password" required>
              </div>
            </div>

            <div class="field">
              <div class="ui left icon input">
                <i class="lock icon"></i>
                <input type="password" name="password__confirmation" placeholder="Gentag Password" v-model.trim="password__confirmation" required>
              </div>
            </div>

            <div class="ui fluid large blue submit button" @click.prevent="register" :class="{ 'loading': isLoading}">Registrer</div>
          </div>

          <div class="ui error message" v-if="hasErrors">
            <p v-for="error in errors" :key="error.id">
              {{error}}
            </p>
          </div>

        </form>

        <div class="ui message">
          Allerede bruger? <router-link to="/login">Login</router-link>
        </div>
      </div>
    </div> -->
    <div class="container">
    <form>
        <div class="form-group col-lg-6 container">
          <div class="input-group input-group-lg mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="fas fa-user"></i></span>
            </div>
            <input type="text" class="form-control" name="name" placeholder="Navn" v-model.trim="name" required>
          </div>
          <div class="input-group input-group-lg mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="fas fa-envelope"></i></span>
            </div>
            <input type="email" class="form-control" name="email" placeholder="Email" v-model.trim="email" required>
          </div>
          <div class="input-group input-group-lg mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="fas fa-unlock"></i></span>
            </div>
            <input type="password" class="form-control" name="password" placeholder="Password" v-model.trim="password" required>
          </div>
          <div class="input-group input-group-lg mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="fas fa-unlock"></i></span>
            </div>
            <input type="password" class="form-control" name="password__confirmation" placeholder="Gentag password" v-model.trim="password__confirmation" required>
          </div>
          <div class="mb-4">
            <button class="btn btn-lg btn-block btn-primary transition-3d-hover" @click.prevent="register">Registrer</button>
          </div>
          <div class="text-center mb-2">
            <p class="text-muted">Allerede bruger? <router-link to="/login">Login</router-link></p>
          </div>
        </div>

        <div class="alert alert-danger col-md-6 container" role="alert" v-if="hasErrors">
          <h4 class="alert-heading">Fejl, prøv igen</h4>
          <hr>
          <p v-for="error in errors" :key="error.index">
             {{error}}
          </p>
          <hr>
        </div>

    </form>
  </div>
  </div>
</template>

<script>
import md5 from 'md5'

export default {
  name: 'register',
  data () {
    return {
      name: '',
      email: '',
      password: '',
      password__confirmation: '',
      errors: [],
      usersRef: firebase.database().ref('users'),
      isLoading: ''
    }
  },
  computed: {
    hasErrors() {
      return this.errors.length > 0
    }
  },
  methods: {
    register() {
      this.errors = [];

      if(this.isFormValid()) {
        this.isLoading = true
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then( user => {

          user.updateProfile({
            displayName: this.name,
            photoURL: "http://www.gravatar.com/avatar/"+md5(user.email)+"?d=identicon"
          }).then( () => {
            this.saveUserToUsersRef(user).then( () => {
              this.$store.dispatch('setUser', user)
              this.$router.push('/login')
            })

          }, error => {
            console.log(error)
            this.errors.push(error.message)
            this.isLoading = false
          })
        }).catch(error => {
          console.log(error)
          this.errors.push(error.message)
          this.isLoading = false
        })
      }
    },
    saveUserToUsersRef(user) {
      return this.usersRef.child(user.uid).set({
        name: user.displayName,
        avatar: user.photoURL
      })
    },
    isEmpty() {
      if(this.name.length == 0 || this.email.length == 0 || this.password.length == 0 || this.password__confirmation.length ==  0) {
        return true;
      }
      return false;
    },
    passwordValid() {
      if(this.password < 6 || this.password__confirmation < 6) {
        return false;
      }
      if (this.password !== this.password__confirmation) {
        return false;
      }
      return true;
    },
    isFormValid() {
      if(this.isEmpty()) {
        this.errors.push('Udfyld alle felter')
        return false;
      }
      if(!this.passwordValid()) {
        this.errors.push('Forkert password')
        return false;
      }
      return true;
    }
  }
}

</script>

<style scoped>
.register__container {
  margin: 25vh 0;
}

.text-muted a {
    color: #007bff;
  }
</style>
