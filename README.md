# TypeScript Project

# Frontend and Backend Setup and Installation

 Lets discuss the set up! After cloning your project into your downloads folder and extracting that zipped file to its home destination we need to get both programs running!

This Project contains a backend database and a front-end website that both need to be activated. Lets start with the Backend, where we need to create a virtual environment to let it all run!

- In VSCode, open the folder "BEC_Module_6_API_Ecom-main", located in the "Database" folder
- Open a new Terminal either in VSCode or on the main computer. Make sure it is a command line Terminal, not Powershell! Enter the command *python3 venv venv* to start the process!
- Once the prompt line returns, input *venv\Scripts\activate* to activate our virtual enviroment to run our backend
- Now that it is active, we need to install all the requirements needed for the backend. To do so, simply enter pip install *-r requirements.txt* and it should download everything
- Finally, to make our backend run, simply input *py app.py* and the backend should link to our the local host and run

Now Lets create our frontend and show off our Super Store:

- In a new VSCode window, open the folder "E-commerce" and start up another Terminal
- Input the following code: *npm create vite@latest* to start the process of creating a vite project in react! 
- when prompted, select *React* as the Project type and then select *Typescript* as the language
- cd into the folder and preform the *npm i* requested in the command prompt. 
- Next, we need to download all the other applications we used! To do so, copy and paste the following into the command prompt : 
    npm i axios react-bootstrap bootstrap react-router-dom react-redux @reduxjs/toolkit
- Lastly, lets get get it up and running with the command *npm run dev * and go to your local host to see it come to life!