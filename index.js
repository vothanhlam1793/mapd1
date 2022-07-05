const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const { MongoClient } = require('mongodb');
const MongoStore = require('connect-mongo');
const initialiseData = require("./initial-data");
// File Enviroment
const dotenv = require('dotenv')
dotenv.config()

// List
const User = require("./lists/User");
const Marker = require("./lists/Marker");
const Project = require("./lists/Project");
const Hello = require("./lists/Hello");

const PROJECT_NAME = process.env.PROJECT_NAME;

// MongoDB for APP
const adapterConfig = { 
    mongoUri: process.env.MONGO_URL_APP,
    "user": process.env.MONGO_USER_APP,
    "pass": process.env.MONGO_PASS_APP,
    authSource: process.env.MONGO_AUTH_SOURCE_APP,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// MongoDB for SESSION
var db = new MongoClient(process.env.MONGO_URL_SESSION,{
    auth: {
        "user": process.env.MONGO_USER_SESSION,
        "password": process.env.MONGO_PASS_SESSION,
    },
    authSource: process.env.MONGO_AUTH_SOURCE_SESSION,
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const keystone = new Keystone({
    adapter: new Adapter(adapterConfig),
    sessionStore: MongoStore.create({ 
        clientPromise: db.connect()
    }),
    cookie: {
        secure: false,
        // secure: process.env.NODE_ENV === 'production', // Default to true in production
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        sameSite: false,
    },
    cookieSecret: "THU NGHIEM MOT CAI GI DO NO DAI THIET DAI LA DUOC MA PHAI KHONG",
    onConnect: process.env.CREATE_TABLES !== 'true' && initialiseData,
});

keystone.createList("User", User);
keystone.createList("Marker", Marker);
keystone.createList("Project", Project);
keystone.createList("Hello", Hello);

const authStrategy = keystone.createAuthStrategy({
    type: PasswordAuthStrategy,
    list: 'User',
    config: { 
        identityField: 'username', // default: 'email'
        secretField: 'password', // default: 'password'
    },
});

class App {
    prepareMiddleware({ keystone, dev, distDir }) {
      return require("./app/index").middle(keystone, dev, distDir);
    }
}

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      name: PROJECT_NAME,
      enableDefaultRoute: false,
      authStrategy,
    }),
    new App(),
  ],
};
