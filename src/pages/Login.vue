<template>
<div class="login__container">
  <!-- <div class="login__container">
    <div class="ui middle aligned center aligned grid">
      <div class="column">
        <h2 class="ui blue image header">
          <div class="content">
            Login
          </div>
        </h2>
        <form class="ui large form" :class="{'error' : hasErrors }">
          <div class="ui stacked segment">

            <div class="field">
              <div class="ui left icon input">
                <i class="user icon"></i>
                <input type="text" name="email" placeholder="Email" v-model.trim="email" required
                @keyup.enter="login">
              </div>
            </div>

            <div class="field">
              <div class="ui left icon input">
                <i class="lock icon"></i>
                <input type="password" name="password" placeholder="Password" v-model.trim="password" required
                @keyup.enter="login">
              </div>
            </div>

            <div class="ui fluid large blue submit button" @click.prevent="login" :class="{ 'loading': isLoading}">Login</div>
          </div>

          <div class="ui error message" v-if="hasErrors">
            <p v-for="error in errors" :key="error.index">
              {{error}}
            </p>
          </div>

        </form>

        <div class="ui message">
          Ikke bruger? <router-link to="/register">Registrer</router-link>
        </div>
      </div>
    </div>
  </div> -->
  <div class="container">
    <form>
        <div class="form-group col-lg-6 container">
          <div class="input-group input-group-lg mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="fas fa-envelope"></i></span>
            </div>
            <input type="email" class="form-control" name="email" placeholder="Email" v-model.trim="email" required @keyup.enter="login">
          </div>
          <div class="input-group input-group-lg mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="fas fa-unlock"></i></span>
            </div>
            <input type="password" class="form-control" name="password" placeholder="Password" v-model.trim="password" required @keyup.enter="login">
          </div>
          <div class="mb-4">
            <button class="btn btn-lg btn-block btn-primary transition-3d-hover" @click.prevent="login">Login</button>
          </div>
          <div class="text-center mb-2">
            <p class="text-muted">Ikke bruger? <router-link to="/register">Registrer</router-link></p>
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

export default {
  name: 'login',
  // input fra html formen, data bliver gemt på variabler
  data() {
    return {
      email: '',
      password: '',
      errors: [],
      isLoading: ''
    }
  },
  computed: {
    hasErrors() {
      return this.errors.length > 0
    }
  },
  methods: {
    login() {

      this.errors = []

      if(this.isFormValid()) {
        this.isloading = true;

        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then( user => {

          this.$store.dispatch('setUser', user)
          this.$router.push('/chat')

        }).catch(error => {
          this.errors.push(error.message)
          this.isLoading = false
        })
      }
    },
    isFormValid() {
      if(this.email.length > 0 && this.password.length > 0) {
        return true;
      }
      return false;
    }
  }
}

</script>

<style scoped>
  .login__container {
    margin: 25vh 0;
  }

  .transition-3d-hover {
    transition: all 0.2s ease-in-out;
  }

  .transition-3d-hover:hover {
    transform: translateY(-3px);
  }

  .text-muted a {
    color: #007bff;
  }
</style>
