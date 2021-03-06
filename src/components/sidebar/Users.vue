<template >
  <div class="users__container container">
    <div class="ui feed" v-for="user in users" :key="user.uid" :class="{'is_active': isActive(user)}" @click.prevent="changeChannel(user)">
      <div class="row">
        <img class="rounded-circle" :src="user.avatar" alt="avatar">
        <div>
          <span class="user__label font-weight-bold"> {{ user.name }}</span>
          <span class="status__label rounded-circle connection__label" :class="{'green': isOnline(user), 'red': !isOnline(user)}"></span>
          <span class="text-muted" v-if="getNotification(user) >= 1">
            - {{ getNotification(user) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import mixin from '../mixins'

export default {
  name: 'users',
  data() {
    return {
      users: [],
      usersRef: firebase.database().ref('users'),
      connectedRef: firebase.database().ref('.info/connected'),
      presenceRef: firebase.database().ref('presence'),
      privateMessagesRef: firebase.database().ref('privateMessages'),
      notifCount: [],
      channel: null
    }
  },
  mixins: [mixin],
  computed: {
    ...mapGetters(['currentUser', 'currentChannel', 'isPrivate'])
  },
  watch: {
    isPrivate() {
      if(!this.isPrivate) {
        this.resetNotifications()
      }
    }
  },
  mounted() {
    this.addListeners()
  },
  methods: {
    addListeners() {
      this.usersRef.on('child_added', snap => {

        if(this.currentUser.uid !== snap.key) {
          let user = snap.val()
          user['uid'] = snap.key
          user['status'] = 'offline'
          this.users.push(user)
        }
      })

      //check user status
      this.presenceRef.on('child_added', snap => {
        if(this.currentUser.uid !== snap.key) {
          this.addStatusToUser(snap.key)
          let channelId = this.getChannelId(snap.key)

          this.privateMessagesRef.child(channelId).on('value', snap => {
            this.handleNotification(channelId, this.currentChannel.id, this.notifCount, snap)
          })
        }
      })


      this.presenceRef.on('child_removed', snap => {
        if(this.currentUser.uid !== snap.key) {
          this.addStatusToUser(snap.key, false)

          this.privateMessagesRef.child(this.getChannelId(snap.key)).off()

        }
      })

      this.connectedRef.on('value', snap => {
        if(snap.val() === true) {
          let ref = this.presenceRef.child(this.currentUser.uid)
          ref.set(true)
          ref.onDisconnect().remove( err => {
            if(err !== null) console.log(err)
          })
        }
      })
    },
    addStatusToUser(userId, connected = true) {
      let index = this.users.findIndex( user => user.uid === userId)
      if(index !== -1) {
        connected === true ? this.users[index].status = 'online' : this.users[index].status = 'offline'
      }
    },
    isOnline(user) {
      return user.status === 'online'
    },
    changeChannel(user) {

      if(this.channel === null) {
        this.resetNotifications(user)
      } else {
        this.resetNotifications()
      }

      let channelId = this.getChannelId(user.uid)
      let channel = {id: channelId, name: user.name}

      this.channel = channel
      this.$store.dispatch('setPrivate', true)
      this.$store.dispatch('setCurrentChannel', channel)
    },
    isActive(user) {
      let channelId = this.getChannelId(user.uid)
      return this.currentChannel.id === channelId
    },
    getChannelId(userId) {
      return userId < this.currentUser.uid ? userId + '/' + this.currentUser.uid : this.currentUser.uid + '/' + userId
    },
    getNotification(user) {
      let channelId = this.getChannelId(user.uid)
      let notif = 0

      this.notifCount.forEach(el => {
        if(el.id === channelId) {
          notif = el.notif
        }
      })

      return notif
    },
    resetNotifications(user = null) {
      let channelId = null

      if(user !== null) {
        channelId = this.getChannelId(user.uid)
      } else {
        channelId = this.channel.id
      }

      let index = this.notifCount.findIndex( el => el.id === channelId)

      if(index !== -1 ) {
        this.notifCount[index].total = this.notifCount[index].lastKnownTotal
        this.notifCount[index].notif = 0
      }
    },
    detachListeners() {
      this.usersRef.off()
      this.presenceRef.off()
      this.connectedRef.off()
    }
  },
  beforeDestroy() {
    this.detachListeners()
  }
}
</script>

<style scoped>

  .users__container{
    min-height: 100px;
    max-height: 30vh!important;
    overflow-y: auto!important;
  }

  .users__container .row{
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    align-items: center;
  }
  .users__container .row:hover{
    background: #FFFFFF;
  }
  .users__container .row.is_active{
    background: #FFFFFF;
  }
  .connection__label{
    float:left!important;
    margin-right: 12px!important;
    margin-top: 5px;
    margin-left: 5px;
  }
  .user__label {
    margin-top: 4px;
    text-transform: none;
  }
  .channel__count{
    float:right;
  }

  .status__label {
    background: grey;
    width: 15px;
    height: 15px;
  }

  .status__label.red {
    background-color: #dc3545;
  }

  .status__label.green {
    background-color: #28a745;
  }
</style>
