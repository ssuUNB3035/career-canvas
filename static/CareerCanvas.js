Vue.component('user-card', {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    showUserPageClick() {
      this.$parent.showUserPage = true;

      this.$parent.showMyPortfolio = false;
      this.$parent.showUserSearch = false;
      this.$parent.showAbout = false;
    }
  },
  template: `
    <div class="card">
      <img class="rounded-circle mr-2" style="width: 200px; height: auto;" src="https://img.icons8.com/nolan/256/user-default.png" alt="Profile Picture" />
      <div class="card-body">
        <h5 class="card-title">{{ user.name }}</h5>
        <p class="card-text">{{ user.bio }}</p>
        <button @click="showUserPageClick" class="btn btn-primary">View Profile</button>
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
      this.$parent.$parent.popupVisible = true;
    },
    logout() {
      axios
      .delete(this.serviceURL+"/user/login")
      .then(response => {
          if (response.status == "success") {
            this.$parent.$parent.authenticated = false;
          }
      });
    },
  },
  template: `
    <div>
      <button v-if="!this.$parent.$parent.authenticated" @click="login" type="button" class="btn btn-primary">Login</button>
      <button v-if="this.$parent.$parent.authenticated" @click="logout" type="button" class="btn btn-primary">Logout</button>
    </div>
  `
});

Vue.component('navbar', {
  methods: {
    userSearchClick() {
      this.$parent.showUserSearch = true;
      this.$parent.showMyPortfolio = false;
      this.$parent.showAbout = false;
      this.$parent.showUserPage = false;
      console.log(this.$parent.showUserSearch);
    },
    myPortfolioClick() {
      this.$parent.showUserSearch = false;
      this.$parent.showMyPortfolio = true;
      this.$parent.showAbout = false;
      this.$parent.showUserPage = false;
      console.log(this.$parent.showMyPortfolio);
    },
    aboutClick() {
      console.log("c");
      this.$parent.showUserSearch = false;
      this.$parent.showMyPortfolio = false;
      this.$parent.showAbout = true;
      this.$parent.showUserPage = false;
      console.log(this.$parent.showAbout);
    },
  },
  template: `
    <nav class="navbar">
      <img src="./resource/websiteLogoWhite.png" class="logo" />
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
  showUserPage: false,
  currentUser: {
    created: null,
    displayName: "Your Display Name",
    intro: "Your Introduction",
    lastUpdated: null,
    userId: 0,
    userName: "Your Username"
  },
  users: [
    { id: 1, name: 'John Doe', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus semper sapien eget mi tincidunt euismod.', image: 'https://via.placeholder.com/350x200', link: 'https://www.example.com/profile1' },
    { id: 2, name: 'Jane Smith', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus semper sapien eget mi tincidunt euismod.', image: 'https://via.placeholder.com/350x200', link: 'https://www.example.com/profile2' },
    { id: 3, name: 'Bob Johnson', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus semper sapien eget mi tincidunt euismod.', image: 'https://via.placeholder.com/350x200', link: 'https://www.example.com/profile3' },
    { id: 4, name: 'Alice Brown', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus semper sapien eget mi tincidunt euismod.', image: 'https://via.placeholder.com/350x200', link: 'https://www.example.com/profile4' },
    { id: 5, name: 'Mike Lee', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus semper sapien eget mi tincidunt euismod.', image: 'https://via.placeholder.com/350x200', link: 'https://www.example.com/profile5' },
  ],
  currentUser_selectedPortfolio: 'Portfolio #1',
  currentUser_portfolios: ['Portfolio #1', 'Portfolio #2', 'Portfolio #3'],
  currentUser_subEntryMap: {
  'Portfolio #1': [
      { title: 'Card 1', description: 'This is card 1', image: 'https://via.placeholder.com/150' },
      { title: 'Card 2', description: 'This is card 2', image: 'https://via.placeholder.com/150' },
      { title: 'Card 3', description: 'This is card 3', image: 'https://via.placeholder.com/150' },
      { title: 'Card 4', description: 'This is card 4', image: 'https://via.placeholder.com/150' },
      { title: 'Card 5', description: 'This is card 5', image: 'https://via.placeholder.com/150' },
      { title: 'Card 6', description: 'This is card 6', image: 'https://via.placeholder.com/150' },
  ],
  'Portfolio #2': [
      { title: 'Card 7', description: 'This is card 7', image: 'https://via.placeholder.com/150' },
      { title: 'Card 8', description: 'This is card 8', image: 'https://via.placeholder.com/150' },
      { title: 'Card 9', description: 'This is card 9', image: 'https://via.placeholder.com/150' },
      { title: 'Card 10', description: 'This is card 10', image: 'https://via.placeholder.com/150' },
      { title: 'Card 11', description: 'This is card 11', image: 'https://via.placeholder.com/150' },
      { title: 'Card 12', description: 'This is card 12', image: 'https://via.placeholder.com/150' },
  ],
  'Portfolio #3': [
      { title: 'Card 13', description: 'This is card 13', image: 'https://via.placeholder.com/150' },
      { title: 'Card 14', description: 'This is card 14', image: 'https://via.placeholder.com/150' },
      { title: 'Card 15', description: 'This is card 15', image: 'https://via.placeholder.com/150' },
      { title: 'Card 16', description: 'This is card 16', image: 'https://via.placeholder.com/150' },
      { title: 'Card 17', description: 'This is card 17', image: 'https://via.placeholder.com/150' },
      { title: 'Card 18', description: 'This is card 18', image: 'https://via.placeholder.com/150' },
  ]
  },
  selectedUser: {
    created: null,
    displayName: "Your Display Name",
    intro: "Your Introduction",
    lastUpdated: null,
    userId: 0,
    userName: "Your Username"
  },
  selectedUser_selectedPortfolio: 'Portfolio #1',
  selectedUser_portfolios: ['Portfolio #1', 'Portfolio #2', 'Portfolio #3'],
  selectedUser_subEntryMap: {
  'Portfolio #1': [
      { title: 'Card 1', description: 'This is card 1', image: 'https://via.placeholder.com/150' },
      { title: 'Card 2', description: 'This is card 2', image: 'https://via.placeholder.com/150' },
      { title: 'Card 3', description: 'This is card 3', image: 'https://via.placeholder.com/150' },
      { title: 'Card 4', description: 'This is card 4', image: 'https://via.placeholder.com/150' },
      { title: 'Card 5', description: 'This is card 5', image: 'https://via.placeholder.com/150' },
      { title: 'Card 6', description: 'This is card 6', image: 'https://via.placeholder.com/150' },
  ],
  'Portfolio #2': [
      { title: 'Card 7', description: 'This is card 7', image: 'https://via.placeholder.com/150' },
      { title: 'Card 8', description: 'This is card 8', image: 'https://via.placeholder.com/150' },
      { title: 'Card 9', description: 'This is card 9', image: 'https://via.placeholder.com/150' },
      { title: 'Card 10', description: 'This is card 10', image: 'https://via.placeholder.com/150' },
      { title: 'Card 11', description: 'This is card 11', image: 'https://via.placeholder.com/150' },
      { title: 'Card 12', description: 'This is card 12', image: 'https://via.placeholder.com/150' },
  ],
  'Portfolio #3': [
      { title: 'Card 13', description: 'This is card 13', image: 'https://via.placeholder.com/150' },
      { title: 'Card 14', description: 'This is card 14', image: 'https://via.placeholder.com/150' },
      { title: 'Card 15', description: 'This is card 15', image: 'https://via.placeholder.com/150' },
      { title: 'Card 16', description: 'This is card 16', image: 'https://via.placeholder.com/150' },
      { title: 'Card 17', description: 'This is card 17', image: 'https://via.placeholder.com/150' },
      { title: 'Card 18', description: 'This is card 18', image: 'https://via.placeholder.com/150' },
  ]
  },
},
computed: {
  cards() {
      return this.selectedUser_subEntryMap[this.selectedUser_selectedPortfolio];
  },
  selectedUserCards() {
      return this.selectedUser_subEntryMap[this.selectedUser_selectedPortfolio];
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

      // Logs User in
      axios
      .post(this.serviceURL+"/user/login", {
          "username": this.username,
          "password": this.password
      })
      .then(response => {
          if (response.data.status == "success") {
            this.authenticated = true;
            this.loggedIn = response.data.user_id;
            this.currentUser = response.data.user[0];

            // Gets all the portfolios for the user
            axios
            .get(this.serviceURL+"/portfolio/" + this.currentUser.userId)
            .then(response => {
                if (response.data.status == "success") {
                  var portfolios = [];
                  var tempArray = response.data.portfolios;

                  let map = {};

                  // Puts the portfolio title in an array
                  for (let i = 0; i < tempArray.length; i++){
                    portfolios.push(tempArray[i].title);

                    // Maps all of the subEntries to a portfolio name
                    axios
                    .get(this.serviceURL+"/portfolio/" + this.currentUser.userId + "/" + tempArray[i].portfolioId)
                    .then(response => {
                        if (response.data.status == "success") {
                          map[tempArray[i].title] = response.data.subPortfolios;
                        }
                    })
                  }
                  this.currentUser_portfolios = portfolios;
                  this.currentUser_selectedPortfolio = portfolios[0];
                  this.currentUser_subEntryMap = map;
                }
            })
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