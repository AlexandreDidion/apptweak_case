# AppTweak Frontend challenge (boilerplate)

## Introduction

To evaluate your programming skills, we would like to share a fun challenge with you! The main goal will be to create a **simplified version of the Spotify UI using client-side React**. For this, you will have to use the Spotify API (see setup instructions below) to fetch and edit data and update the UI accordingly.

## Description of the features

For this particular Spotify version, we want to let our users create new Playlists and add tracks to them. Every feature listed below is **mandatory** and should be implemented as part of this challenge.

As a user (currently logged in):

* I should be able to create a new playlist and specify a name and optionally a description.
* I should be able to select an existing playlist and display its content (every track added to it).
* I should be able to perform a search for any tracks and consult the search results.
* I should be able to add any search results in the currently selected playlist.
* I should be able to remove a given track from a playlist.

*To help you design the app, we provide you with some low-fidelity wireframes. We ask you to respect the placement of each element and to polish the final rendering in order to improve the final result.*

Here is the link to the Spotify documentation where you will find all the technical information needed to tackle this challenge: https://developer.spotify.com/documentation/web-api.

### Nice to have

If you want more opportunities to show us your personal touch and technical skills, you are welcome to add extra features. Here are a few ideas:

* Edit a playlist's details.
* Sort the tracks by name, artist, duration, and so on (every track's field).
* Reorder tracks within a given playlist.
* Display additional track information (bars, beats, sections, segments, … )
* Dark / light mode toggle.
* Want to do even more? Please feel free to surprise us! ;-)

## Requirements

To carry out this project, we ask you to use the following:

* React with function components,
* TypeScript,
* Redux state management with [redux-toolkit](https://redux-toolkit.js.org/), and [redux-sagas](https://redux-saga.js.org/) for side effects,
* Track your work in a Git repository. **Note**: We will ask you to share that repository with us when you are done.

To polish the UX and UI, feel free to add any third-party library that suits your needs. This is not required however, and we will judge the output fairly regardless.

### AI / LLM Usage Policy

You may use AI tools as you implement your solution, but you must use them responsibly and transparently.

To help us evaluate your work, **we ask you to document your use of AI tools in your repository or in your email when you send us the case**, stating which tools you used and for what purposes and aspects of your project you used them.

When we review the case with you, we will evaluate your ability to own and challenge the delivered solution without AI assistance.

## Setup

You will need a Spotify API key for this project. If you already have a personal Spotify Premium account or a trial account, read on. Otherwise, please reach out to us and we will provide you with a temporary Client ID of our own.

To get started, here are the instructions you need to follow:

1. In the Spotify developer dashboard, create a new Application: https://developer.spotify.com/dashboard
2. Copy your Client ID into the environment variable (`REACT_APP_SPOTIFY_CLIENT_ID`) to a file named `.env.local` in the project’s root. We created the boilerplate with [Create React App](https://github.com/facebook/create-react-app) which uses [dotenv](https://www.npmjs.com/package/dotenv) to load these additional environment variables into your app.
3. Don’t forget to set up the redirect URI in your app settings on the Spotify developer dashboard.

This boilerplate is already set up to authenticate to the Spotify API using the "Authorization Code with PKCE" flow. You are welcome to make changes to the auth code (nothing is off-bounds!), but it should in principle work fine without your intervention.

## Timing & how to get help

We will give you a **time limit** to send us your code. If you finish it before, that's perfect!

If you want, we can organize a meeting of 15-30 minutes during the allotted time to answer your questions

Our culture at AppTweak is defined by four values, which include "Learn" and "Play". We learn from each other and thrive to develop new skills and ourselves. And we know there isn't one best way of doing things, which is why we also like to explore. So we value people asking for help when they don’t know, and trying new ideas.

Therefore, if something is not clear, if you are stuck or have a question about the direction to take, **really do not hesitate to reach out to your designated person of contact by email**.

Finally, in order to share your final work with us, push it to a **public repository** on GitHub, GitLab, Bitbucket or another code forge. Once done, you can share the link to your repository with us so we can start to review your code.

## Wireframes

The wireframes will be sent separately.

## How to run this project?

The project uses Yarn Classic as its package manager. We recommend setting it up through corepack. In recent Node.js releases, corepack itself must be installed first with `npm install -g corepack`. Then, run `corepack enable` to make Yarn available, and run `yarn` to install dependencies.

In the project directory, you can then run

### `yarn start`

which runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

The React app is built and run using Create React App. You can learn more about it in the [Create React App documentation](https://create-react-app.dev/docs/getting-started/).
