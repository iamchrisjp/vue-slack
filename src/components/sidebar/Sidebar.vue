<template>
  <div class="sidebar__container">
    <!-- <ConnectedUser></ConnectedUser> -->
    <div class="btn-group">  
      <div class="btn sidebar__close__btn" @click.prevent="closeSidebar"><i class="fas fa-angle-left"></i></div>
    </div>
    <h2 class="container">Klynger</h2>
    <Channels></Channels>
    <h2 class="container">Læger</h2>
    <users></users>
  </div>
</template>

<script>

  import ConnectedUser from './ConnectedUser';
  import Channels from './Channels';
  import Users from './Users';

  export default {
    name: 'Sidebar',
    components: { ConnectedUser, Channels, Users },
    methods: {
      closeSidebar() {
          $('.sidebar__container').hide()
        }
    }
  }

</script>

<style scoped>

  .sidebar__container{
    position: fixed;
    flex-flow: column nowrap;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: #f3f3f3;
    padding-top: 70px;
    z-index: 1;
    -webkit-box-shadow: 2px 0px 10px 0px rgba(186,186,186,0.5);
    -moz-box-shadow: 2px 0px 10px 0px rgba(186,186,186,0.5);
    box-shadow: 2px 0px 10px 0px rgba(186,186,186,0.5);
  }

  .sidebar__close__btn {
    display: none;
  }

  .sidebar__container {
      padding-top: 120px;
    }

  @media screen and (min-width: 991px) {
    .sidebar__container {
      display: block !important;
    }
  }

  @media screen and (max-width: 991px) {
    .sidebar__close__btn {
      display: block;
      position: fixed;
      top: 70px;
      right: 0;
      z-index: 1;
      padding: 0.5rem 2rem;
      border-radius: 1rem 0 0 1rem;
      border: none;
      background-color: #2962ff;
      -webkit-box-shadow: 4px 0px 12px 0px rgba(0,0,0,0.25);
      -moz-box-shadow: 4px 0px 12px 0px rgba(0,0,0,0.25);
      box-shadow: 4px 0px 12px 0px rgba(0,0,0,0.25);
    }

    .fa-angle-left {
      margin-right: .5rem;
      margin-left: -.7rem;
      color: white;
      width: .8rem;
      margin-top: 5px;
    }

    .sidebar__container {
      padding-top: 70px;
    }
  }

  @media screen and (max-height: 800px) {
    .sidebar__container {
      padding-top: 70px;
    }
  }
</style>
