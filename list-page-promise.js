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

// Define global variables used for creating objects.
var objectCount = 0;
var BUCKET_NAME = "myBucket";
var OBJECT_KEY = "myObjectValue";

// Called when the user is logged in or registered.
function openListPage() {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("list-page").style.display = "block";

    // Clear the existing objects from the list.
    var listView = document.getElementById("list-view");
    listView.innerHtml = "";

    // Create an empty KiiQuery. This query will retrieve all results sorted by the creation date.
    var queryObject = KiiQuery.queryWithClause(null);
    queryObject.sortByDesc("_created");

    // Get the defined bucket belonging to the user.
    var bucket = KiiUser.getCurrentUser().bucketWithName(BUCKET_NAME);

    // Perform the query asynchronously.
    bucket.executeQuery(queryObject).then(
        // If the query succeeded
        function(params) {
            var queryPerformed = params[0];
            var result = params[1];
            var nextQuery = params[2];
            console.log("Execute query: got " + result.length + " objects");

            // Iterate through the result set.
            for(var i = 0; i < result.length; i++) {
                // Create a row element with the object.
                var row = createListItem(result[i]);
                listView.appendChild(row);
            }
        }
    ).catch(
        // If the query failed
        function(error) {
            var errorString = error.message;
            alert("Unable to execute query: " + errorString);
            console.log("Unable to execute query: " + errorString);
        }
    );
}

// Create a <li> element as an item in the list box.
function createListItem(object) {
    // Create elements of the list item.
    var elementItem = document.createElement('li');
    var elementTitle = document.createElement('div');
    var elementSubtitle = document.createElement('div');
    var elementDelete = document.createElement('div');

    // Set the value of each element.
    elementTitle.innerText = object.get(OBJECT_KEY);
    elementTitle.className = "item-title";

    elementSubtitle.innerText = object.objectURI();
    elementSubtitle.className = "item-subtitle";

    elementDelete.innerText = "Delete";
    elementDelete.className = "item-button";
    elementDelete.onclick = function (e) { deleteItem(this.parentNode, object); };

    // Set the elements as children of the list item.
    elementItem.appendChild(elementTitle);
    elementItem.appendChild(elementDelete);
    elementItem.appendChild(elementSubtitle);

    return elementItem;
}

// Called by the "Add Item" button.
function addItem() {
    var value = "MyObject " + (++objectCount);

    var bucket = KiiUser.getCurrentUser().bucketWithName(BUCKET_NAME);

    // Create a new KiiObject instance and set the key-value pair.
    var obj = bucket.createObject();
    obj.set(OBJECT_KEY, value);

    // Save the object asynchronously.
    obj.save().then(
        // If the object was saved
        function(theSavedObject) {
            console.log("Save succeeded: " + JSON.stringify(theSavedObject));

            // Insert the object at the top of the list.
            var row = createListItem(theSavedObject);
            var listView = document.getElementById("list-view");
            listView.insertBefore(row, listView.firstChild);
        }
    ).catch(
        // If the object was not saved
        function(error) {
            var errorString = error.message;
            alert("Unable to create object: " + errorString);
            console.log("Unable to create object: " + errorString);
        }
    );
}

// Called by the "Delete" button.
function deleteItem(elementItem, object) {
    // Delete the object asynchronously.
    object.delete().then(
        // If the object was deleted
        function(theDeletedObject) {
            console.log("Delete succeeded: " + JSON.stringify(theDeletedObject));

            var listView = document.getElementById("list-view");
            listView.removeChild(elementItem);
        }
    ).catch(
        // If the object was not deleted
        function(theObject, error) {
            var errorString = error.message;
            alert("Unable to delete object: " + errorString);
            console.log("Unable to delete object: " + errorString);
        }
    );
}
