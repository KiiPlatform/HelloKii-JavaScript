/*

 Copyright 2016 Kii Corporation
 http://kii.com

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

*/

// called by the 'Log In' button on the UI
function performLogIn() {
    // get the username/password combination from the UI
    var username = document.getElementById("username-field").value;
    var password = document.getElementById("password-field").value;

    // authenticate the user asynchronously
    KiiUser.authenticate(username, password).then(
        // authentication succeeded
        function(theUser) {
            console.log("User authenticated: " + JSON.stringify(theUser));

            // go to the main screen
            openListPage();
        }
    ).catch(
        // authentication failed
        function(error) {
            var errorString = error.message;
            console.log("Unable to authenticate user: " + errorString);
            alert("Unable to authenticate user: " + errorString);
        }
    );
}

// the user clicked the 'sign up' button
function performSignUp() {
    // get the username/password combination from the UI
    var username = document.getElementById("username-field").value;
    var password = document.getElementById("password-field").value;

    // create a KiiUser object
    var user = KiiUser.userWithUsername(username, password);
    user.register().then(
        // registration suceeded
        function(theUser) {
            console.log("User registered: " + JSON.stringify(theUser));

            // go to the main screen
            openListPage();
        }
    ).catch(
        // registration failed
        function(error) {
            var errorString = error.message;
            alert("Unable to register user: " + errorString);
            console.log("Unable to register user: " + errorString);
        }
    );
}
