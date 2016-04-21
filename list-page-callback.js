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

// define some global variables for list page
var objectCount = 0;
var BUCKET_NAME = "myBucket";
var OBJECT_KEY = "myObjectValue";

// called when login or registration finished
function openListPage() {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("list-page").style.display = "block";

    // clear the existing objects from the list
    var listView = document.getElementById("list-view");
    listView.innerHtml = "";

    // create an empty KiiQuery (will return all objects in the bucket)
    var queryObject = KiiQuery.queryWithClause(null);
    queryObject.sortByDesc("_created");

    // get the defined bucket belonging to this user
    var bucket = KiiUser.getCurrentUser().bucketWithName(BUCKET_NAME);

    // perform the asynchronous query, with callbacks defined
    bucket.executeQuery(queryObject, {
        // query succeeded
        success: function(queryPerformed, result, nextQuery) {
            console.log("Execute query: got " + result.length + " objects");

            // iterate through the result set
            for(var i = 0; i < result.length; i++) {
                // create a row UI element based on the object
                var row = createListItem(result[i]);
                listView.appendChild(row);
            }
        },
        // query failed
        failure: function(queryPerformed, errorString) {
            alert("Unable to execute query: " + errorString);
            console.log("Unable to execute query: " + errorString);
        }
    });
}

// create a <li> element as an item in the list box
function createListItem(object) {
    // create elements in the list item
    var elementItem = document.createElement('li');
    var elementTitle = document.createElement('div');
    var elementSubtitle = document.createElement('div');
    var elementDelete = document.createElement('div');

    // set the field value for each element
    elementTitle.innerText = object.get(OBJECT_KEY);
    elementTitle.className = "item-title";

    elementSubtitle.innerText = object.objectURI();
    elementSubtitle.className = "item-subtitle";

    elementDelete.innerText = "Delete";
    elementDelete.className = "item-button";
    elementDelete.onclick = function (e) { deleteItem(this.parentNode, object); };

    // set elements as children of the list item
    elementItem.appendChild(elementTitle);
    elementItem.appendChild(elementDelete);
    elementItem.appendChild(elementSubtitle);

    return elementItem;
}

// called by the 'Add Item' button on the UI
function addItem() {
    var value = "MyObject " + (++objectCount);

    var bucket = KiiUser.getCurrentUser().bucketWithName(BUCKET_NAME);

    // create a new KiiObject and set a key/value
    var obj = bucket.createObject();
    obj.set(OBJECT_KEY, value);

    // perform an asynchronous creation, with callbacks
    obj.save({
        // save suceeded
        success: function(theSavedObject) {
            console.log("Save succeeded: " + JSON.stringify(theSavedObject));

            // add new item at the top of the list
            var row = createListItem(theSavedObject);
            var listView = document.getElementById("list-view");
            listView.insertBefore(row, listView.firstChild);
        },
        // save failed
        failure: function(theObject, errorString) {
            alert("Unable to create object: " + errorString);
            console.log("Unable to create object: " + errorString);
        }
    });
}

// called by the 'Delete' button on the UI
function deleteItem(elementItem, object) {
    // perform an asynchronous deletion, with callbacks
    object.delete({
        // delete suceeded
        success: function(theDeletedObject) {
            console.log("Delete succeeded: " + JSON.stringify(theDeletedObject));

            var listView = document.getElementById("list-view");
            listView.removeChild(elementItem);
        },
        // delete failed
        failure: function(theObject, errorString) {
            alert("Unable to delete object: " + errorString);
            console.log("Unable to delete object: " + errorString);
        }
    });
}
