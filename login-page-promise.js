/*

 Copyright 2017 Kii Corporation
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

// Called by the "Log In" button.
function performLogIn() {
    // Get the username and password from the UI.
    var username = document.getElementById("username-field").value;
    var password = document.getElementById("password-field").value;

    // Authenticate the user asynchronously.
    KiiUser.authenticate(username, password).then(
        // If the user was authenticated
        function(theUser) {
            console.log("User authenticated: " + JSON.stringify(theUser));

            // Go to the main screen.
            openListPage();
        }
    ).catch(
        // If the user was not authenticated
        function(error) {
            var errorString = error.message;
            console.log("Unable to authenticate user: " + errorString);
            alert("Unable to authenticate user: " + errorString);
        }
    );
}

// Called by the "Sign Up" button.
function performSignUp() {
    // Get the username and password from the UI.
    var username = document.getElementById("username-field").value;
    var password = document.getElementById("password-field").value;

    // Create a KiiUser object.
    var user = KiiUser.userWithUsername(username, password);
    // Register the user asynchronously.
    user.register().then(
        // If the user was registered
        function(theUser) {
            console.log("User registered: " + JSON.stringify(theUser));

            // Go to the main screen.
            openListPage();
        }
    ).catch(
        // If the user was not registered
        function(error) {
            var errorString = error.message;
            alert("Unable to register user: " + errorString);
            console.log("Unable to register user: " + errorString);
        }
    );
}
