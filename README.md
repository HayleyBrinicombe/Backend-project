# NC Games - Game Reviews API

A hosted version of this repository is available here: https://hb-games.herokuapp.com/

## Background

This backend project creates a sample API for a game reviewing website.

It has endpoints for reviews and categories along with functionality to sort by different parameters and add new comments. (Details of the endpoints can be found here https://hb-games.herokuapp.com/

The project makes use of Javascript, Node.js, PostgreSQL and Express.js.

## Setup

Please ensure you have the following installed on your machine before continuing with the rest of the installation:

Node.js 14.17.0 or later
NPM
Git
PostgreSQL

Firstly you will need to clone the repository using the following command within your terminal:

```
$ git clone https://github.com/HayleyBrinicombe/Backend-project
```

Then you will need to install all of the necessary dependencies for the app using the following command:

```
$ npm i
```

It is required that to run this databases locally you will need to also create necessary .env files. To do this you need to create 2 files within the db folder with the contents as shown below:

```
Filename: .env.development    Content of file: "PGDATABASE=nc_games"
Filename: .env.test           Content of file: "PGDATABASE=nc_games_test"
```

Once these files have been created you can run the following commands within your terminal to create and populate the databases:

```
$ npm run setup-dbs
$ npm run seed
$ npm run test
```

From here you will be able to launch the application which will open within your web browser (localhost:9090) by using the below command:

```
$ npm start
```

## Future addition plans

- Add the ability to delete comments by ID
- Add a users endpoint
- Add the ability to patch comments by ID
