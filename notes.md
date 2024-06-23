Basic Tasks
I stored the auth token in localStorage on the frontend.
I created a logout page, on the frontend, which calls /logout, and basically deletes the token. 
I did see something on stackoverflow, where they blacklist the token on the backend, but didn't get enough time to implement. I've added it as a comment in the /logout function inside app.py
I used MUI to improve Register and Login. 
I used the wireframe to create a React profile page. I wanted to add some routing logic, such as on logout, it takes the user to home page, or if the user hasn't logged in, it doesn't show the page, but wasn't able to implement it within the time frame, as I chose to move forward with more major tasks.


Version Management 
I was getting some CORS error when I tried to change to APIService.ts, I thought I fixed it when I added allow_headers=["Authorization", "Content-Type","app-version"] in app.py. This fixed the issue for login, but I was still facing similar issues with /user endpoint. I spent around 30 mins on this, but wasn't able to fix it properly, and chose to move forward. 


Audio Recording
I updated the Profile page to handle mediaRecordings as well. When the recording button is clicked twice, it stops recording and calls the /upload function, and sends the audio blob, and the username in the request. Here also, I am not using the APIService method, and that needs to be updated. 

In app.py, I just created a VERY BASIC dummy function which transcribes the audio and returns some string, with the random waiting. I saved the text to the DB as the users motto, but wasn't able to find time to update it in the profile page in the frontend.


------------------------------------
This is after the deadline. You can use commit msg "coding challenge commit 1" as the submission

# Update 1: 
updated register to use APIService; and added routes from register to login, login to profile, profile to logout

# Update 2: 
Changed to APIService calls. Checks for app version have been added. The upload endpoint is giving me some CORS issue, so that's still using the old fetch() routine

# Update 3: 
Minor improvements, added motto to the db, updated user profile to display self recorded audio
Upload is still causing some CORS issue, so haven't used APIService for /upload endpoint
Encryption and decryption of user's motto is complete, I used the cryptography module, and updated it in the requirements.txt
I'm hardcoding a key, so that key is same across server restarts. Need to think of a better method for this.

# Update 4:

Moved AudioRecorder parts to different typescript file

Improvements to be done: 
1. Fix CORS issue in /upload
2. Add a token blacklist on the backend? (Need to read more about this)