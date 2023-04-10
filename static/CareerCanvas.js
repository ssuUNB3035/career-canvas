Vue.component('portfolio-nav', {
  computed: {
    currentUser_portfolios() {
      return this.$parent.currentUser_portfolios;
    },
    portfolioKey() {
      return this.$parent.currentUser_portfolios.length;
    }
  },
  methods: {
    setCurrentPortfolio(currentUser_portfolio) {
      this.$parent.currentUser_selectedPortfolio = currentUser_portfolio;
    }
  },
  template: `
    <ul style="max-height: 60vh; overflow-y: auto;">
      <li v-for="(currentUser_portfolio, index) in this.$parent.currentUser_portfolios">
        <a @click="setCurrentPortfolio(currentUser_portfolio)">{{ currentUser_portfolio }}</a>
      </li>
    </ul>
  `
});

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
        <a @click="showUserPageClick" class="btn btn-primary">View Profile</a>
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
    this.parentParent = this.$parent.$parent;
  },
  methods: {
    login() {
      // Code for login
      // Set popupVisible to true to show the login form
      this.parentParent.popupVisible = true;
    },
    logout() {
      localStorage.removeItem('token');
      this.loggedIn = false;
    },
    showProfileEditPopup() {
      this.parentParent.profileEditPopup = true;
    },
    showPortfolioEditPopup() {
      this.parentParent.portfolioEditPopup = true;
    }
  },
  template: `
    <div>
      <button v-if="!this.$parent.$parent.authenticated" @click="login" type="button" class="btn btn-primary">Login</button>
      <button v-if="this.$parent.$parent.authenticated" @click="showProfileEditPopup" type="button" class="btn btn-primary">Edit Profile</button>
      <button v-if="this.$parent.$parent.authenticated" @click="showPortfolioEditPopup" type="button" class="btn btn-primary">Edit Portfolios</button>
      <button v-if="this.$parent.$parent.authenticated" @click="logout" type="button" class="btn btn-primary">Logout</button>
    </div>
  `
});

Vue.component('navbar', {
  methods: {
    userSearchClick() {
      this.$parent.showUserPage = false;
      this.$parent.showUserSearch = true;
      this.$parent.showMyPortfolio = false;
      this.$parent.showAbout = false;
    },
    myPortfolioClick() {
      this.$parent.showUserPage = false;
      this.$parent.showUserSearch = false;
      this.$parent.showMyPortfolio = true;
      this.$parent.showAbout = false;
    },
    aboutClick() {
      this.$parent.showUserPage = false;
      this.$parent.showUserSearch = false;
      this.$parent.showMyPortfolio = false;
      this.$parent.showAbout = true;
    }
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
  profileEditPopup: false,
  portfolioEditPopup: false,
  newPortfolioTitle: "",
  selectedCurrentUserPortfolio: "Portfolio #1",
  addPortfolioTitle: "",
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
  allCurrentUserPortfolios: {},
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
      return this.currentUser_subEntryMap[this.currentUser_selectedPortfolio];
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
  showProfileEditPopup: function() {
    this.profileEditPopup = true;
  },
  closeProfileEditPopup: function() {
    this.profileEditPopup = false;
  },
  showPortfolioEditPopup: function() {
    this.portfolioEditPopup = true;
  },
  closePortfolioEditPopup: function() {
    this.portfolioEditPopup = false;
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
                  this.allCurrentUserPortfolios = response.data.portfolios;
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
                  this.selectedCurrentUserPortfolio = portfolios[0];
                  this.currentUser_subEntryMap = map;
                  console.log(this.currentUser_portfolios);
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
  },
  saveProfileChanges() {
    console.log("hello!");
    axios
      .put(this.serviceURL+"/user/" + this.currentUser.userName, {
        "userId": this.currentUser.userId,
        "userName": this.currentUser.userName,
        "displayName": this.currentUser.displayName,
        "intro": this.currentUser.intro,
        "media_id": "0"
      })
      .then(response => {
          if (response.status == 200) {
            alert("Saved profile changes!");
          }
      })
      .catch(e => {
        alert("Something wrong happened...");
    });

    this.profileEditPopup = false;
  },
  renamePortfolio() {
    let selectedPortfolioId = "";

    this.allCurrentUserPortfolios.forEach(p => {
      if (p.title == this.selectedCurrentUserPortfolio) {
        selectedPortfolioId = p.portfolioId;
      }
    });

    if (selectedPortfolioId != "") {
      axios
        .put(this.serviceURL+"/portfolio/" + this.currentUser.userId, {
          "portfolioId": selectedPortfolioId,
          "title": this.newPortfolioTitle
        })
        .then(response => {
          if (response.status == 200) {
            // Replace data with new
            let tempPortfolios = this.currentUser_portfolios;
            for(let i = 0; i < tempPortfolios.length; i++) {
              if (tempPortfolios[i] == this.selectedCurrentUserPortfolio) {
                tempPortfolios[i] = this.newPortfolioTitle;
              }
            }
            this.currentUser_portfolios = tempPortfolios;

            this.currentUser_subEntryMap[this.newPortfolioTitle] = this.currentUser_subEntryMap[this.selectedCurrentUserPortfolio];
            delete this.currentUser_subEntryMap[this.selectedCurrentUserPortfolio];
          }
          
          // Cheeky refresh 
          this.currentUser_portfolios.push("reloading...");
          this.currentUser_portfolios.pop();
        });
    }
  },
  addPortfolio() {
    axios
      .post(this.serviceURL+"/portfolio/" + this.currentUser.userId, {
        "title": this.addPortfolioTitle
      })
      .then(response => {
        if (response.status == 200) {
          this.currentUser_portfolios.push(this.addPortfolioTitle);
          this.currentUser_subEntryMap[this.addPortfolioTitle] = [];
        }
      })
      .catch(e => {
        console.log(e);
      });
  },
  deletePortfolio() {
    let selectedPortfolioId = "";

    this.allCurrentUserPortfolios.forEach(p => {
      if (p.title == this.selectedCurrentUserPortfolio) {
        selectedPortfolioId = p.portfolioId;
      }
    });

    console.log(selectedPortfolioId);
    axios
      .delete(this.serviceURL+"/portfolio/" + this.currentUser.userId, {
        "portfolioId": selectedPortfolioId
      })
      .then(response => {
        if (response.status == 200) {
          const index = this.currentUser_portfolios.indexOf(this.selectedCurrentUserPortfolio);
          if (index > -1) {
            this.currentUser_portfolios.splice(index, 1);
          }
          delete this.currentUser_subEntryMap[this.selectedCurrentUserPortfolio];
        }
      })
      .catch(e => {
        console.log(e);
      });
  }
  }
});