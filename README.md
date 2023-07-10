React-Node Community App
========================

# URL : [http://ec2-54-89-217-115.compute-1.amazonaws.com/](http://ec2-18-233-98-211.compute-1.amazonaws.com/)

This repository contains a community application built using React, Node.js, and TypeScript. The application aims to replicate the functionality of the popular website Reddit. It provides the following features:

## Technologies Used

- **Next.js**
- **Node.js**
- **TypeScript**
- **Docker**
- **PostgreSQL**
- **Tailwind CSS**
- **AWS EC2**

## Functionality Description

The React-Node Community App offers the following functionalities:

- **User SignUp**: Allows users to create new accounts and join the community.
- **SignIn**: Enables registered users to log in and access their accounts.
- **SignOut**: Allows logged-in users to end their current session.
- **Community Creation**: Users can create new communities for topic-based discussions.
- **Post Creation**: Users can create posts within communities to share content and start discussions.
- **Comment Writing**: Users can write comments on posts to express thoughts and engage in conversations.
- **Voting**: Users can vote on posts and comments to indicate approval or disapproval.
- **Image Upload**: Users can upload images to include in their posts or comments.


## Technologies Issue(So far)


1. I think it is not possible to install Docker and deploy both the client and server within a single EC2 instance while using PM2 for deployment, 
considering the limitations of the AWS EC2 Free Tier.
In the future, I plan to find a more cost-effective and suitable cloud service to redeploy.


2.I plan to add functionality for modifying or deleting data in the future



Getting Started
---------------

To get started with the React-Node Community App, follow the steps below:

1.  Clone the repository:

   ```
   git clone https://github.com/jungwonJung/React-Node-Community-app.git
   ```

2.  Install the dependencies:

   ```
   cd React-Node-Community-app
   npm install
   ```

3.  Start the development server:

   ```
   npm run dev
   ```

    The application will be accessible at `http://localhost:3000`.


