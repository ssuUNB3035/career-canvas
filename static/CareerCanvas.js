Vue.component('user-card', {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  template: `
    <div class="card">
      <img class="card-img-top" :src="user.image" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">{{ user.name }}</h5>
        <p class="card-text">{{ user.bio }}</p>
        <a :href="user.link" class="btn btn-primary">View Profile</a>
      </div>
    </div>
  `
});

Vue.component('login-logout', {
  data() {
    return {
      loggedIn: false,
    }
  },
  mounted() {
    this.loggedIn = !!localStorage.getItem('token');
  },
  methods: {
    login() {
      // Code for login
      // Set popupVisible to true to show the login form
      console.log("why");
      this.$parent.$parent.popupVisible = true;
    },
    logout() {
      localStorage.removeItem('token');
      this.loggedIn = false;
    },
  },
  template: `
    <div>
      <button v-if="!loggedIn" @click="login" type="button" class="btn btn-primary">Login</button>
      <button v-if="loggedIn" @click="logout" type="button" class="btn btn-primary">Logout</button>
    </div>
  `
});

Vue.component('navbar', {
  methods: {
    userSearchClick() {
      this.$parent.showUserSearch = true;
      this.$parent.showMyPortfolio = false;
      this.$parent.showAbout = false;
      console.log(this.$parent.showUserSearch);
    },
    myPortfolioClick() {
      this.$parent.showUserSearch = false;
      this.$parent.showMyPortfolio = true;
      this.$parent.showAbout = false;
      console.log(this.$parent.showMyPortfolio);
    },
    aboutClick() {
      console.log("c");
      this.$parent.showUserSearch = false;
      this.$parent.showMyPortfolio = false;
      this.$parent.showAbout = true;
      console.log(this.$parent.showAbout);
    },
  },
  template: `
    <nav class="navbar">
      <img src="../resource/websiteLogoWhite.png" class="logo" />
      <ul class="tabs">
        <li>
          <button @click="userSearchClick" type="button" class="btn btn-outline-primary">User Search</button>
        </li>
        <li>
          <button @click="myPortfolioClick" type="button" class="btn btn-outline-primary">My Portfolio</button>
        </li>
        <li>
          <button @click="aboutClick" type="button" class="btn btn-outline-primary">About</button>
        </li>
      </ul>
      <div>
        <login-logout></login-logout>
      </div>
    </nav>
  `
});

  var app = new Vue({
  el: '#app',
  data: {
    serviceURL: "https://cs3103.cs.unb.ca:8021",
    authenticated: false,
    loggedIn: null,
    popupVisible: false,
    username: '',
    password: '',
    showUserSearch: true,
    showMyPortfolio: false,
    showAbout: false,
    users: [
      { id: 1, name: 'John Doe', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus semper sapien eget mi tincidunt euismod.', image: 'https://via.placeholder.com/350x200', link: 'https://www.example.com/profile1' },
      { id: 2, name: 'Jane Smith', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus semper sapien eget mi tincidunt euismod.', image: 'https://via.placeholder.com/350x200', link: 'https://www.example.com/profile2' },
      { id: 3, name: 'Bob Johnson', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus semper sapien eget mi tincidunt euismod.', image: 'https://via.placeholder.com/350x200', link: 'https://www.example.com/profile3' },
      { id: 4, name: 'Alice Brown', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus semper sapien eget mi tincidunt euismod.', image: 'https://via.placeholder.com/350x200', link: 'https://www.example.com/profile4' },
      { id: 5, name: 'Mike Lee', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus semper sapien eget mi tincidunt euismod.', image: 'https://via.placeholder.com/350x200', link: 'https://www.example.com/profile5' },
    ],
    selectedOption: 'Option 1',
    options: ['Option 1', 'Option 2', 'Option 3'],
    cardData: {
    'Option 1': [
        { title: 'Card 1', description: 'This is card 1', image: 'https://via.placeholder.com/150' },
        { title: 'Card 2', description: 'This is card 2', image: 'https://via.placeholder.com/150' },
        { title: 'Card 3', description: 'This is card 3', image: 'https://via.placeholder.com/150' },
        { title: 'Card 4', description: 'This is card 4', image: 'https://via.placeholder.com/150' },
        { title: 'Card 5', description: 'This is card 5', image: 'https://via.placeholder.com/150' },
        { title: 'Card 6', description: 'This is card 6', image: 'https://via.placeholder.com/150' },
    ],
    'Option 2': [
        { title: 'Card 7', description: 'This is card 7', image: 'https://via.placeholder.com/150' },
        { title: 'Card 8', description: 'This is card 8', image: 'https://via.placeholder.com/150' },
        { title: 'Card 9', description: 'This is card 9', image: 'https://via.placeholder.com/150' },
        { title: 'Card 10', description: 'This is card 10', image: 'https://via.placeholder.com/150' },
        { title: 'Card 11', description: 'This is card 11', image: 'https://via.placeholder.com/150' },
        { title: 'Card 12', description: 'This is card 12', image: 'https://via.placeholder.com/150' },
    ],
    'Option 3': [
        { title: 'Card 13', description: 'This is card 13', image: 'https://via.placeholder.com/150' },
        { title: 'Card 14', description: 'This is card 14', image: 'https://via.placeholder.com/150' },
        { title: 'Card 15', description: 'This is card 15', image: 'https://via.placeholder.com/150' },
        { title: 'Card 16', description: 'This is card 16', image: 'https://via.placeholder.com/150' },
        { title: 'Card 17', description: 'This is card 17', image: 'https://via.placeholder.com/150' },
        { title: 'Card 18', description: 'This is card 18', image: 'https://via.placeholder.com/150' },
    ]
    }
  },
  computed: {
    cards() {
        return this.cardData[this.selectedOption];
    }
  },
  methods: {
    userSearchClick: function () {
      this.showUserSearch = true;
      this.showMyPortfolio = false;
      this.showAbout = false;
    },
    myPortfolioClick: function () {
      this.showUserSearch = false;
      this.showMyPortfolio = true;
      this.showAbout = false;
    },
    showAboutClick: function () {
      this.showUserSearch = false;
      this.showMyPortfolio = false;
      this.showAbout = true;
    },
    showPopup: function() {
      this.popupVisible = true;
    },
    closePopup: function() {
      this.popupVisible = false;
    },
    submitForm: function() {
      if (this.username != "" && this.password != "") {
        axios
        .post(this.serviceURL+"/user/login", {
            "username": this.input.username,
            "password": this.input.password
        })
        .then(response => {
            if (response.data.status == "success") {
              this.authenticated = true;
              this.loggedIn = response.data.user_id;
            }
        })
        .catch(e => {
            alert("The username or password was incorrect, try again");
            this.input.password = "";
            console.log(e);
        });
      } else {
        alert("A username and password must be present");
      }

      this.popupVisible = false;
    }
  }
});