
var groupDataJSON = {"groups":""};
var GLOBALGroupName;
function createGroupTable(){
    db.transaction(function(tx){
        tx.executeSql("create table GROUPTABLE (groupName TEXT UNIQUE, users TEXT)"
                      ,[],function(result){
        //alert("created group table: "+ result);
        });    
    });
}

/*
Input: Needs field to filled
Output: Creates a row in the group table
Example: createGroup()
*/
function createGroup(){
    //doAll();
    doGroup();
    var users = " ";
    var groupName = GLOBALGroupName;
    db.transaction(function(tx){
        tx.executeSql("insert into GROUPTABLE values(?,?)", 
                      [groupName,users]);
        alert("New Group: " +groupName+ " has been made");
    });
    showGroups();
}
/* Expected to return string of users. must be split(',') elsewhere
Usage: getUserTimesInGroup("group3",startGroupUpload);
Output: Draw boxes for all user times.
Problem: as soon as you hover over box, it disapears.
*/ 
function getUserTimesInGroup(groupname,callback){
    var result;
 	var userArray;
     db.transaction(function(tx){
         //console.log(tx);
         tx.executeSql("SELECT users FROM GROUPTABLE WHERE groupName = '"+groupname+"'", [], function(tx,result){
 							
 				var length = result.rows.length;
				if(length > 0)
				{
					var row = result.rows.item(0);
					userArray = row['users'];
				}
 				
				if(callback){
					userArray =  callback(userArray);
/* 					//console.log("here");
					//console.log(userArray); */
					return userArray;
				}
  
         });
 
 		
     });  
}
/*
Usage: remove userName from groupName in table
Input: removeUserFromGroup("userName","groupName")
Output: removes userName from field of users of that groupName in table
*/
function removeUserFromGroup(userName,groupName){
	
	var realUsers;
	var updatedUsers;
	    db.transaction(function(tx){
        tx.executeSql("SELECT users FROM GROUPTABLE WHERE groupName = '"+groupName+"'", [], function(tx,result){
				
				var rlength = result.rows.length;
				if(rlength > 0){
					var row = result.rows.item(0);
					updatedUsers = row['users'].split(',');
					
					for(var x = 0; x < updatedUsers.length; x++){

						if(userName == updatedUsers[x]){
							realUsers = updatedUsers.splice(x,1);
						}
/* 						//console.log(updatedUsers + "    her2\n");
						//console.log(realUsers + "       real2\n"); */
					}
					
				}

        });
    });
	db.transaction(function(tx){
        tx.executeSql("UPDATE GROUPTABLE SET users   = '"+ updatedUsers +"' \
                                            WHERE groupName ='"+ groupName+"'");
        });
		showGroups();
}
/*
Input: String of the groupname
Output: Edits table to get rid of that group
Example: deleteGroup("Group Name")
*/
function deleteGroup(groupname){
    db.transaction(function(tx){
        tx.executeSql("DELETE FROM GROUPTABLE WHERE groupName = '"+groupname+"'");
    });
        //console.log("We are in delete group");
        showGroups();
}
/*
Input: Nothing
Output: Delete all groups
Example: deleteAllGroups()
*/
function deleteAllGroups(){
    db.transaction(function(tx){
        tx.executeSql("DELETE FROM GROUPTABLE");
    });
    //console.log("Group table cleared");
    showGroups();
}
/*
Input: username as string, groupname as string.
Output: groupname in table adds username to their users field
Example: addUserToGroup("user1","groupname")
*/
function addUserToGroup(username,groupname){
    var flag = 0;
    var moduser = username;
    db.transaction(function(tx){
			tx.executeSql("SELECT users FROM GROUPTABLE WHERE groupName = '"+groupname+"'", [], function(tx,result){
                var row = result.rows.item(0);
                var times = row['users'].split(",");
                //console.log(times.length);
                if(times.length != 0){
                    moduser = ","+username;
                }
                //console.log(times.length);
                
                for(var i = 0; i < times.length; i++){
                    if(times[i] == username){
                        flag = 1;
                        //alert("user:"+username+" already added to "+ groupname);
                        return; 
                    }
                }
                db.transaction(function(tx){
                    tx.executeSql("UPDATE GROUPTABLE SET users = users || '"+moduser+"' \
                                                        WHERE groupName = '"+groupname+"'");
                });
			});
			
		});
    

    showGroups();
}
/*
Input: groupname as string, callback as function
Output: pass the users as an array of strings to the callback function
Example: getUsersInGroup("group5", )
*/
function getUsersInGroup(groupname, callback){
	var userArray;
	db.transaction(function(tx){
         //console.log(tx);
         result = tx.executeSql("SELECT users FROM GROUPTABLE WHERE groupName = '"+groupname+"'", [], function(tx,result){
 							
 				var length = result.rows.length;
				if(length > 0)
				{
					var row = result.rows.item(0);
					userArray = row['users'].split(',');
				}
 				
				if(callback){
					userArray =  callback(userArray);
					return userArray;
				}
  
         });
 
 		
     });  
}
/*
Input:
Output:
Example: loadGroup()
*/
function loadGroup(){
    doGroup();
    //console.log(groupLoadedDB);
    
    var groupName = groupLoadedDB.groups[0].groupName;
    var users = groupLoadedDB.groups[0].users;
    
    db.transaction(function(tx){
        //if(length == 0){
            tx.executeSql("insert into GROUPTABLE values(?,?)", 
                          [groupName, users]);
            //alert("Group: " +groupName+ " has been loaded");
            
            //window.location.href = "/public/index.html?"+"username="+userName;
        //}
    });
    showGroups();  
}
/*
Input: Nothing
Output: Show the groups and the users in each group
Example: showGroups()
*/
function showGroups(){
    db.transaction(function(tx){
        tx.executeSql("SELECT groupName, users FROM GROUPTABLE", [], function(tx,result){
            for(var i = 0; i< result.rows.length;i++){
                var row = result.rows.item(i);
                console.log(row['groupName']+"  "+row['users']);
            }
        });
    });
}
/*
Input:
Output:
Example: GROUPtoJSON()
*/
function GROUPtoJSON(){

    var link = window.location.href.split("groupName=");
    var groupName = link[1];
    
    db.transaction(function(tx){
        result = tx.executeSql("SELECT * FROM GROUPTABLE WHERE groupName = '"+groupName+"'" ,[],function(tx,result){
             var row = result.rows;
             groupDataJSON.groups = row;
             //console.log(groupDataJSON);
        });
    });
}
/*
Input:
Output:
Example: JSONtoGROUP()
*/
function JSONtoGROUP(){
    //console.log(groupDataJSON.groups);
    loadGroup();
}
/*
Input:
Output:
Example: helperAddUserToGroup()
*/
function helperAddUserToGroup(){
    var username = document.getElementById("name1").value;
  
    var link = window.location.href.split("groupName=");
    var groupName = link[1];
    
    addUserToGroup(username, groupName);
    resetData();
    setTimeout( getUserTimesInGroup(groupName, startGroupUpload), time2);
    
    
}
/*
Input:
Output:
Example: realHelperAddUserToGroup()
*/
function realHelperAddUserToGroup(){
    
    var username = document.getElementById("name1").value;
    GLOBALUserName = username;
    setTimeout(readUserData,time1);
    setTimeout(function(){
                JSONtoUSER();
                var link = window.location.href.split("groupName=");
                var groupName = link[1];
                
                helperAddUserToGroup();}
               ,time3);
   
    setTimeout(function(){
                            addGroupToUser(username,groupName);
                            GROUPtoJSON();
                         },time4);

    setTimeout( helperAddUserToGroup, time5);
    setTimeout( function(){ 
                    var link = window.location.href.split("groupName=");
                    var groupName = link[1];
                    getUsersInGroup(groupName,setUserList)
                    userNum++;
                    colornumarr.push(userNum);
                    
                    setTimeout(writeGroupData,time1);
                }
               , time6);
}
/*
Input: Nothing
Output: Make table/ database
Example: doGroup()
*/

function doGroup(){
    openUserDatabase();
    createGroupTable();
    showGroups();
}