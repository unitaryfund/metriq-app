# Locally setting up MetriQ  

In order to locally run and host the `metriq` application we require the use of the following GitHub repositories:

- `metriq-app`: The front-end component of `metriq`
- `metriq-api`: The back-end component of `metriq`
- `metriq-client`: This is a Python API client that posts submissions and other data to the back-end component of `metriq`
- `metriq-postgres`: **(Optional)** This contains the exported PostgreSQL collections of our development and database.

## Setting up `metriq-api`

The following system variables need to be present in your `.bashrc` file. Add
the following lines into your `.bashrc`, making sure to alter the values of the
`[REDACTED]` entries as necessary.

```bash
export METRIQ_SECRET_KEY='[REDACTED]'
export METRIQ_SUPPORT_EMAIL_SERVICE='gmail'
export METRIQ_SUPPORT_EMAIL_ACCOUNT='support@unitary.fund'
export METRIQ_SUPPORT_EMAIL_PASSWORD='[REDACTED]'
export METRIQ_SUPPORT_EMAIL_ADDRESS='support@unitary.fund'
```

`METRIQ_SECRET_KEY` can be anything, but, for a realistic secret key, start the API project without this environment variable set at all. The app will automatically generate and print a random secret key for temporary use, and this can copied and pasted into `export METRIQ_SECRET_KEY=...` for permanent use.

### Dependencies

You will need
[`npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
installed on your machine.

Install [`nodemon`](https://www.npmjs.com/package/nodemon).

You will require [Postman](https://winter-zodiac-492730.postman.co/home) and
will need to request to be added to the Postman account associated with
`metriq`.

### Usage

Run the `metriq-api` component from the root of the `metriq-api` project:

```bash
nodemon start index.js
```

You should see output that looks like the following to indicate that it is
running on port `8080`. 

```bash
➜  metriq-api git:(main) nodemon index.js
[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
Db connection successful
Support email is configured.
Running RestHub on port 8080
```

Run the `metriq-app` component from the root of the `metriq-app` project:

```bash
npm install
npm start
```

You should see something like:

```bash
Compiled successfully!

You can now view metriq in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://10.102.87.32:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

to indicate that the local instance of the website is being hosted as
`http://localhost:3000`. You can verify this by opening a browser and navigating
to localhost URL.

Once you have both `metriq-api` and `metriq-app` hosting locally, you can seed
the local instance of the database with the data from the
[`metriq-postgres`](https://github.com/unitaryfund/metriq-postgres) repo.

Following the instructions in the `README.md` file of the `metriq-postgres` repo will
populate your local instance of the database with dummy data from the `.JSON`
files.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

(The RESTful API project should be running at the same time, via `node index` on the command line in its respective project directory.)

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
