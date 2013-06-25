function getFileSystem(){    
  //  alert("getfilesystem---");
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onGetFileSystemSuccess, onGetFileSystemFail); 
}

function onGetFileSystemSuccess(fileSystem){
    root = fileSystem.root;  
    root.getDirectory("Clients", {create: true, exclusive: false}, onGetClientsDirectoryWin, onGetDirectoryFail);
}

function onGetFileSystemFail(evt){
         // console.log(evt.target.error.code);
}   



function onGetMetaDataSuccess(metadata){
    alert("onGetMetaDataSuccess");
    alert("metadata"+ metadata);
        
    $.each(metadata, function(index,value){
        alert("index="+index);
        alert("metadata["+index+"]="+value);
    });
    console.log("Last Modified: " + metadata.modificationTime);
}

function onGetMetaDataFail(error){
      alert("onGetMetaDataFail " + error.code);
}

function onGetDirectoryWin(dir){
   // alert("onGetdirectoryWin");
   // dir.getMetadata(onGetMetaDataSuccess, onGetMetaDataFail);
   // dir.setMetadata(onSetMetadataSuccess, onSetMetadataFail, { "com.apple.MobileBackup": 2});
}

function onSetMetadataSuccess(){
    alert("onSetMetadataSuccess");
}

function onSetMetadataFail(){
    alert("onSetMetadataFail, an error occurred");
}


function onGetDirectoryFail(error){
    alert("unable to find directory: " + error.code);    
}




function onGetClientsDirectoryWin(dir){
    //alert("onGetClientsDirectoryWin");
  //  alert("onGetClientsDirectoryWin: dir="+ dir);
    clientsDir = dir;
   // alert("onGetClientsDirectoryWin:clientsDir.name="+clientsDir.name);
}


function getMyFiles(e){ 
   // alert("getMyFiles");
  //  alert("getMyFiles: e.view.params.dir="+e.view.params.dir);
  //  alert("getMyfiles, activeItem="+activeItem);
    clickItemAction();
    
    //alert("$('#backBtn')="+$('#backBtn'));
    
   // alert("getMyFiles: e.view.params.dir="+e.view.params.dir);
  //  root.getDirectory("Clients", {create: true, exclusive: false}, onGetClientsDirectoryWin, onGetDirectoryFail);
    
    $('#backBtn').hide();
    $('#pasteBtn').removeAttr("onclick");
    
   // alert("getMyFiles: after getDirectory, clientsDir="+clientsDir);
    if(e.view.params.dir == undefined)
    {
      // alert("listing root " + root.name );
       // load();
        listDirectory(root);
    }
    else{
       // alert("listing clientsDir " + clientsDir.name );
        listDirectory(clientsDir);        
     }
}

/*function load(){
    var dirContent = $('#dirContent');
    dirContent.append('<div class="ui-block-a"><a  data-role="button" data-rel="actionsheet" href="#inboxActions" ><p>Reply2</p></a></div>');
    dirContent.append('<div class="ui-block-b"><a  data-role="button" data-rel="actionsheet" href="#inboxActions" ><p>Reply2</p></a></div>');
    dirContent.append('<div class="ui-block-c"><a  data-role="button" data-rel="actionsheet" href="#inboxActions" ><p>Reply2</p></a></div>');
    dirContent.append('<div class="ui-block-d"><a  data-role="button" data-rel="actionsheet" href="#inboxActions" ><p>Reply2</p></a></div>');
}*/


function listDirectory(directoryEntry){      
  // alert("listDirectory");
  //  alert("listDirectory: directoryentry.fullPath="+directoryEntry.fullPath);
    
    $('#fileField').html(directoryEntry.fullPath); 
    
   // alert("listDirectory of " + directoryEntry.name);
    if(!directoryEntry.isDirectory)
        console.log("listDirectory incorrect type");
    
    currentDir = directoryEntry;
  //  alert("currentdir="+ currentDir.name);
    directoryEntry.getParent(function(par){
        parentDir = par;
    //   alert("parentDir.name="+parentDir.name);
        if((parentDir.name == 'sdcard' && currentDir.name != 'sdcard' ) || parentDir.name != 'sdcard')
            $('#backBtn').show();
        }, 
        function(error){
            console.log('Get parent error: '+error.code);        
    });
    
    var directoryReader = directoryEntry.createReader();
    directoryReader.readEntries(function(entries){
        var dirContent = $('#dirContent');
        dirContent.empty();        
        var dirArr = new Array();
        var fileArr = new Array();
        
        
       
     /*****start to show all folders and files****/
       /* for(var i=0; i<entries.length; i++){            
            var entry = entries[i];       
            if(entry.isDirectory && entry.name[0]!='.') {
                dirArr.push(entry);
            }
            else if(entry.isFile && entry.name[0]!='.') {
                fileArr.push(entry);
            }  
         }  
       var sortedArr = dirArr.concat(fileArr);  
      uiBlock = ['a','b','c','d']; 
      for(var i=0;i<sortedArr.length;i++){ 
        item = sortedArr[i];
        letter = uiBlock[i%4];
        if(item.isDirectory)
          dirContent.append('<div class="ui-block-'+letter+'"><div class="folder"><p>'+item.name + '</p></div></div>'); 
        else
          dirContent.append('<div class="ui-block-'+letter+'"><div class="file"><p>'+item.name + '</p></div></div>'); 
       }
        */
      /****end to show all folders and files ****/
        
        
        
        
        
        
       // alert("entries.length="+entries.length);
     
        for(var i=0; i<entries.length; i++){                
            var entry = entries[i]; 
           // alert("directories_to_show.indexOf(" + entry.name + ")=" +directories_to_show.indexOf(entry.name) );
           // alert("files_to_show.indexOf(" + entry.name + ")=" +files_to_show.indexOf(entry.name) );
                if(directories_to_show.indexOf(entry.name) > -1 && entry.isDirectory  == true && entry.name[0]!='.') {
                 //  alert("dirArr:"+ entry.name);
                    dirArr.push(entry);
                }
                else if(files_to_show.indexOf(entry.name) > -1 && entry.isFile && entry.name[0]!='.') {
                  // alert("fileArr:" + entry.name);
                    fileArr.push(entry);
                }
            
         }

        var sortedArr = dirArr.concat(fileArr);
        var uiBlock = null; 
        var item = null;
        var letter = null;
        var portrait = null;
        
        if(currentDir.fullPath.indexOf("Clients") > -1 && currentDir.name != "Clients"){
          //  alert("b, c, d");
             uiBlock = ['b','c','d']; 
            
            
             for(var i=0;i<sortedArr.length;i++){ 
                item = sortedArr[i];
                letter = uiBlock[i%3];
                
                if(letter == 'b'&& i==0)
                 {    
                    portrait = getPortrait(currentUsername);
                    // alert("listdirectory: portrait="+portrait);
                    dirContent.append('<div class="ui-block-a"><img src="' + portrait + '" class="photo_f" style="margin-left:3em;width:96px;height:112.5px;" /><P/><p style="margin-left:4em">'+currentUsername + '</p></div>');
                    
                 }
                else if(letter == 'b' && i>0)
                    dirContent.append('<div class="ui-block-a"></div>');
                 
                if(item.isDirectory){                   
                   // dirContent.append('<div class="ui-block-'+letter+'"><div class="folder"><p>'+item.name + '</p></div></div>'); 
                    dirContent.append('<div class="ui-block-'+letter+'"><a data-rel="actionsheet" data-role="button" href="#inboxActions"  style="text-decoration:none;" data-actionsheet-context="'+item.name +'|d"><div class="folder"><p style="text-decoration:none;">'+item.name + '</p></div></a></div>'); 
                }
                else{
                   // dirContent.append('<div class="ui-block-'+letter+'"><div class="file"><p>'+item.name + '</p></div></div>');   
                    dirContent.append('<div class="ui-block-'+letter+'"><a data-rel="actionsheet" data-role="button" href="#inboxActions"  style="text-decoration:none;" data-actionsheet-context="'+item.name +'|f"><div class="file"><p style="text-decoration:none;">'+item.name + '</p></div></a></div>');   
                }
              }
            
            //in case there's no folder or file, just show the portrait
            if(sortedArr.length == 0){
                portrait = getPortrait(currentUsername);
                dirContent.append('<div class="ui-block-a"><img src="' + portrait+ '" class="photo_f" style="margin-left:3em;width:96px;height:112.5px;" /><P/><p style="margin-left:4em">'+currentUsername + '</p></div>');
            }    
        }
        else
        {            
          //  alert("a, b, c, d");
            uiBlock = ['a','b','c','d']; 
            
            
            for(var i=0;i<sortedArr.length;i++){ 
                item = sortedArr[i];
                letter = uiBlock[i%4];
              //  alert("listDirectory, abcd: item.name="+ item.name);
                
                if(item.isDirectory){ 
                    if(currentDir.name == "Clients")
                    {
                        portrait = getPortrait(item.name);
                     //   alert("listdirectory: portrait="+portrait);
                     //   dirContent.append('<div class="ui-block-'+letter+'"><img src="' + portrait + '" class="photo" style="margin-left:.5em;text-align:left"><div class="folder" style="margin-left:2em"><p>'+item.name + '</p></div></div>'); 
                        dirContent.append('<div class="ui-block-'+letter+'"><div id="wrap"><img src="' + portrait + '" class="photo_f" style="margin-left:1.5em;text-align:left" onmouseover="mouseover(this)" onmouseout="mouseout(this)"/></div><a data-rel="actionsheet"  style="text-decoration:none;" data-role="button" href="#inboxActions" data-actionsheet-context="'+item.name +'|d"><div class="folder" style="margin-left:2em;" ><p style="text-decoration:none;">'+item.name + '</p></div></a></div>');                         
                    }
                    else
                    {
                      //  dirContent.append('<div class="ui-block-'+letter+'"><div class="folder"><p>'+item.name + '</p></div></div>');                       
                        dirContent.append('<div class="ui-block-'+letter+'"><a data-rel="actionsheet" data-role="button"  style="text-decoration:none;" href="#inboxActions" data-actionsheet-context="'+item.name +'|d"><div class="folder"><p style="text-decoration:none;">'+item.name + '</p></div></a></div>');                       
                    }
                }
                else{
                    if(currentDir.name == "Clients")
                    {
                        portrait = getPortrait(item.name);
                     //   alert("listdirectory: portrait="+portrait);
                     //   dirContent.append('<div class="ui-block-'+letter+'"><img src="' + portrait + '" class="photo" style="margin-left:2em;text-align:left"><div class="file"><p>'+item.name + '</p></div></div>');
                        dirContent.append('<div class="ui-block-'+letter+'"><div id="wrap"><img src="' + portrait + '" class="photo_f" style="margin-left:2em;text-align:left" onmouseover="mouseover(this)" onmouseout="mouseout(this)" /></div><a data-rel="actionsheet" data-role="button"  style="text-decoration:none;" href="#inboxActions" data-actionsheet-context="'+item.name +'|f"><div class="file2"><p style="text-decoration:none;">'+item.name + '</p></div></a></div>');
                    }
                    else
                    {
                       // dirContent.append('<div class="ui-block-'+letter+'"><div class="file"><p>'+item.name + '</p></div></div>'); 
                        dirContent.append('<div class="ui-block-'+letter+'"><a data-rel="actionsheet" data-role="button" href="#inboxActions"  style="text-decoration:none;" data-actionsheet-context="'+item.name +'|f"><div class="file"><p style="text-decoration:none;">'+item.name + '</p></div></a></div>'); 
                    }
                }
             }
           
           // alert("end for loop");
           // alert("dirContent="+dirContent.html());
        }
     });    
}

function clickItemAction(){    
 //alert("clickItemAction");    
    var folders = $('.folder');
    var files = $('.file');
    var backBtn = $('#backBtn');
  //  alert("clickItemAction:backBtn="+backBtn);
    
 /*   folders.live('click', function(){    
        alert("folder clicked");
        var name = $(this).text();
        openMenuOptions(); 
        getActiveItem(name,'d');      
    });   */


  /*  files.live('click', function(){
        alert("file clicked");
        var name = $(this).text();
        openMenuOptions();
        getActiveItem(name, 'f');      
    }); */
    
    backBtn.live('click', function(){    
      //  alert("backBtn clicked");
      // alert("backBtn clicked: parentDir="+ parentDir.name);
        
        if(parentDir != null){     
      //      alert("listing parendir" + parentDir.name);
            listDirectory(parentDir);
        } 
    });
}

function getActiveItem(name, type){
 //   alert("getactiveItem, name=" + name + " type=" +type + ",currentDir.name=" + currentDir.name);   
    if(type=='d' && currentDir != null){
        currentDir.getDirectory(name, {create:false},
            function(dir){
              //  alert("getactiveItem success, dir.name="+ dir.name);
                activeItem = dir;
                activeItemType = type;                    
            },
            function(error){
                alert("getactiveItem error" + error.code);
                console.log("unable to find directory: " + error.code);
            });
    }else if(type=='f' && currentDir != null){
        currentDir.getFile(name, {create:false},
            function(file){
                activeItem = file;
                activeItemType = type;
            },
            function(error){
                console.log("unable to find file: " + error.code);
            });
    }
}

function openItem(type){
  //  alert("openItem, type="+ type);
    if(type=='d')
    {// alert("openItem:listDirectory "+ activeItem.name);
      //  alert('currentDir.fullPath.indexOf("Clients")='+currentDir.fullPath.indexOf("Clients"));
      //  alert("currentDir.name="+currentDir.name);
     //   if(currentDir.fullPath.indexOf("Clients") > -1 && currentDir.name == "Clients"){
        if(currentDir.name == "Clients"){            
            currentUsername = activeItem.name;
         }
        listDirectory(activeItem);
    }
    else if(type == 'f'){
        readFile(activeItem);
    }
}

function readFile(fileEntry){
   // alert("readFile");
    if(!fileEntry.isFile) {
        console.log("readFile incorrect type");
        //alert("readfile incorrect type");
     }
    fileEntry.file(function(file){
       // alert("fileEntry.file before getting filereader");
        var reader = new FileReader();
        
        reader.onloadend = function(evt){
          //  alert("reader.onloaded");
            console.log("read as data url");
            console.log("evt.target.result");
            };
        
        reader.readAsDataURL(file);
        if (device.platform === 'Android') {           
		    var path = this.getWorkingFolder().replace('http://', 'file://') + fileEntry.name;
		  //  fileDiv.innerText = path;
		    window.plugins.childBrowser.openExternal(path);
         }
         else{ 
                var url="file://" + fileEntry.fullPath;
                /*with childbroswer*/
    		    //window.plugins.childBrowser.showWebPage(url);
                                        
                 /*inAppbrowser*/
                 var ref = window.open(encodeURI(url), '_blank', 'location=yes');
         }        
    });
    
}

        
function getWorkingFolder() {
	var path = window.location.href.replace('index.html', '');
	return path;
}  

function backBtnClicked(){
    $('#dirContent').empty();
     //  alert("backBtnClicked");
     //  alert("backBtn clicked: parentDir="+ parentDir.name);
        
        if(parentDir != null){
            listDirectory(parentDir);           
        } 
    $('#addFolderDialog').hide();
    
}

function openBtnClick(){   
   // alert("openBtnClick");
    openItem(activeItemType);   
   // closeMenuOptions();
}


function deleteBtnClicked(){
   // alert("deleteBtnClicked");
    var msg = "Are you sure you want to remove " + activeItem.name + "?";   
    $('#confirmDeleteMsg').text(msg);
    var confirmdelete = $('#deleteModal').data("kendoMobileModalView");   
  //  closeMenuOptions();
    confirmdelete.open();
}



function copyBtnCLicked(){
  //  alert("copyBtnClicked");
    getClipboardItem('c');	
   // closeMenuOptions();		
    $('#pasteBtn').attr("onclick", "javascript:pasteBtnCLicked();");
}

function moveBtnCLicked(){
  //  alert("moveBtnCLicked");
    getClipboardItem('m');
  //  closeMenuOptions();
    $('#pasteBtn').attr("onclick", "javascript:pasteBtnCLicked();");    
}

function pasteBtnCLicked(){
  //  alert("pasteBtnclicked"); 
    if( clipboardItem != null && clipboardAction != null ){
		if(clipboardAction == 'c'){ 
          //  alert('copy: '+clipboardItem.name + ' to: '+activeItem.name);
			console.log('copy: '+clipboardItem.name + ' to: '+activeItem.name);
			clipboardItem.copyTo(activeItem,clipboardItem.name,
				function(fileCopy){
					console.log('copy success! '+fileCopy.name);					
                    $('#pasteBtn').removeAttr("onclick");                    
                    openBtnClick();
				}, function(error){
					console.log('copy error: '+error.code);
				}
			);
		} else if(clipboardAction == 'm'){
          //  alert('move: '+clipboardItem.name + ' to: '+activeItem.name);
			console.log('move: '+clipboardItem.name + ' to: '+activeItem.name);
			clipboardItem.moveTo(activeItem,clipboardItem.name,
				function(fileCopy){
					console.log('move success! '+fileCopy.name);					
                    $('#pasteBtn').removeAttr("onclick");
                    openBtnClick();
				}, function(error){
					console.log('move error: '+error.code);
				}
			);
		}
	}
}



function cancelDeleteBtnClicked(){
 //   alert("cancelDeleteBtnClicked");
    closeDeleteConfirmModal();
}

function closeDeleteConfirmModal(){
    $('#deleteModal').data("kendoMobileModalView").close();
}

function okDeleteBtnClicked(){
   // alert("okDeleteBtnClicked");
    if(activeItemType == 'd'){               
        activeItem.removeRecursively(function(){
            console.log("removed recursively with success");
            listDirectory(currentDir);
        },
        function(error){
            console.log("remove recursively with error: "+ error.code);
        });
      }else if(activeItemType == 'f'){
          activeItem.remove(function(){
              console.log("removed file with success");
              listDirectory(currentDir);
          },
          function(error){
              console.log("removed file error: " + error.code);
          });
      }
    closeDeleteConfirmModal();
}

function getClipboardItem(action){
	if( activeItem != null) {
		clipboardItem = activeItem;
		clipboardAction = action;
	}
}

function addBtnClicked(){   
  //  alert("addBtnClicked");    
    $('#addFolderDialog').show();   
    $('#createBtn').click(function(){
        var filename = $('#newFolderName').val();
        var isDir = document.getElementById("radio_d").checked;      
        if(isDir){
            createDirectory(filename);  
            }
        else{
            fileText = $('#filetext').val();          
            createFile(filename);
        } 
    });
 }

function directorySelected(){
    $('#filetext').hide(); 
}


function createBtnClicked(){
  //  alert("createBtnClicked");
    var filename = $('#newName').val();
        var isDir = document.getElementById("radio_d").checked; 
        if(isDir){
            createDirectory(filename);  
            }
        else{
            fileText = $('#filetext').val();         
            createFile(filename);
        }
  closeAddFolderDiaog();
}

function closeAddFolderDiaog(){    
    var dialog=$('#addFolderDialog').data("kendoMobileModalView");
  //  alert("dialog="+dialog);
    dialog.close();
}

   

function createDirectory(name){
  //  alert("createDirectory"); 
    resetAddFolderDialog();
    $('#filetext').hide();
    currentDir.getDirectory(name, {create: true, exclusive: false}, 
    function(parent){
               createDirectirtSuccess(parent, name);
            },
            createDirectoryFail);
    
} 

function createDirectirtSuccess(parent, name) {
  //  alert("createDirectorySuccess, parent.name="+parent.name);
    console.log("Parent Name: " + parent.name);
    
    //upload a file to the server to indicate a new directory is created 
    //at the same time add the new directory name to directories_to_show array.
   /* var fileURI = root.fullPath + '/upload.txt';    
    var url = 'http://'+ SERVER2 + '/TestFileUpload/uploadDirectory.php';
    uploadFile(fileURI, "mydirectory", name, url, onUploadSuccess);    
    directories_to_show[directories_to_show.length]=name;*/
    sendDirectoryName(name);
    listDirectory(currentDir);
}

function sendDirectoryName(name){
    //upload a file to the server to indicate a new directory is created 
    //at the same time add the new directory name to directories_to_show array.
    var fileURI = root.fullPath + '/upload.txt';    
    var url = 'http://'+ SERVER2 + '/TestFileUpload/uploadDirectory.php';
    uploadFile(fileURI, "mydirectory", name, url, onUploadSuccess);  
    updateDirectoriesObj(name);
   /* $.each(directoriesObjArray, function(index, value){
        alert("sendDirectoryName-directoriesObjArray: index="+index+",value="+value);
    });
    
    $.each(directories_to_show, function(index, value){
        alert("sendDirecotryName-directories_to_show: index="+index+",value="+value);
    });
   */
}


function updateDirectoriesObj(name){
   // alert("updateDirectoriesObj");
    var directoryObj = {};
    var indx = name.indexOf(DELIMITER);
    if(indx >-1){//if name is currentUsername and invId
        directoryObj.invId = name.substr(name.lastIndexOf(DELIMITER)+1);         
        directoryObj.name = name.substr(name.lastIndexOf('\\')+1, indx - name.lastIndexOf('\\')-1);    
       // alert("updateDirectoriesObj - directoryObj.invId  = "+ directoryObj.invId );         
       // alert("updateDirectoriesObj - directoryObj.name="+directoryObj.name);         
    }
    else{          
        directoryObj.name = name;
        directoryObj.invId = null;        
    }
    directories_to_show[directories_to_show.length] = directoryObj.name;
    directoriesObjArray.push(directoryObj);
}


function sendFileName(name){
    var fileURI = root.fullPath + '/upload.txt';    
    var url = 'http://'+ SERVER2 + '/TestFileUpload/uploadFile.php';
    uploadFile(fileURI, "myfile", name, url, onUploadSuccess);  
    files_to_show[files_to_show.length]=name;
}

function createDirectoryFail(error) {    
    alert("Unable to create new directory: " + error.code);
}

function createFile(name){
  //  alert("createfile");    
    resetAddFolderDialog();
   
   $('#filetext').hide();
    if(name.indexOf(".txt")==-1)
        name=name+".txt";
    
    currentDir.getFile(name, {create: true, exclusive: false}, 
    function(parent){
        createFileSuccess(parent, name);
    }, 
    createFilefail);
}

function createFileSuccess(parent, name){
  //  alert("file created");
    console.log("Parent Name: " + parent.name);
    
    //upload a file the server
    /*var fileURI = root.fullPath + "/upload.txt";
    var url = 'http://'+ SERVER2 + '/TestFileUpload/uploadFile.php';
    uploadFile(fileURI, "myfile", name, url, onUploadSuccess);
    files_to_show[files_to_show.length] = name;*/
    sendFileName(name);
    parent.createWriter(gotFileWriter, writeFilefail);
    listDirectory(currentDir);
}

function createFilefail(error){
    alert("Failed to retrieve file: " + error.code);
}

function showTextarea(){
    $('#filetext').show();    
}

function gotFileWriter(writer) {
   // alert("gotfileWriter"); 
        writer.write(fileText);
}


function writeFilefail(error) {    
    alert("writefilefail:" + error.code);
        console.log(error.code);
}


function closeMenuOptionsBlockui(){
    alert("blockui closeMenuOptions");
    $.unblockUI(); 
   return false; 
}



function openMenuOptionsModalView(){    
  //  alert("openMenuOptions");
    var win = $('#menuOptions').data("kendoMobileModalView");  
    win.open();   
}


function openMenuOptions(){
    alert("openMenuOptions-actionsheet");
    alert('$("#actionSheet")='+$("#actionSheet"));
    alert('$("#actionSheet").data("kendoMobileActionSheet")'+ $("#actionSheet").data("kendoMobileActionSheet"));
    $("#actionSheet").data("kendoMobileActionSheet").open();
}





function closeMenuOptionsModalView(){    
    $('#menuOptions').data("kendoMobileModalView").close();
}


function closeMenuOptions(){    
    var actionsheet= $('#actionSheet').data("kendoMobileActionSheet");
    alert("closeMenuOptions: actionsheet="+actionsheet);
    actionsheet.close();
}

function openMenuOptionsPopover(){
    alert("openMenuOptions");
    var pop = $('#menuOptions').data("kendoMobilePopOver");
    alert("pop="+pop);
    pop.open();
    alert("app="+app);
    
}

function closeMenuOptionsPopover(){
    $('#menuOptions').data("kendoMobilePopOver").close();
}

function resetAddFolderDialog(){
    $('#newName').val('');
    $('#radio_d').attr("checked", true);
    $('#radio_f').attr("checked", false);
    $('#filetext').val('');
}

function uploadFile(fileUri, key, name, url, onSuccess){    
   // alert("uploadFile");
    var options = new FileUploadOptions();
    options.fileKey = key;  
    options.fileName = name;
        
    //tested with both mineTypes, all worked.
    options.mineType = "text/plain";
  //  options.mineType="image/jpeg";
    var params = {
        val1: "some value",
        val2: "other value"
        };
    options.params = params;
    options.chunkedMode = false;
    
    var ft = new FileTransfer();
    ft.upload(fileUri, encodeURI(url), onSuccess, onUploadFail, options);
}

function getPortrait(name){
   // alert("getPortrait, name="+name);
    var portraitUrl = null;
  //  alert("getPortrait: directoriesObjArray length="+ directoriesObjArray.length);
  
   // for(var i=0;i<directoriesObjArray.length; i++)
   //     alert("loop directoriesObjArray["+i+"].name="+directoriesObjArray[i].name);
    var item = null;
    $.each(directoriesObjArray, function(index,value){    
       // alert("getPortrait:index="+index+",value="+value);
       // alert("getPortrait: value.name="+value.name+", value.invId="+value.invId);
        if( name == value.name && value.invId != null ){
            item = value.invId + ".jpg";  
           // alert("getPortrait:item="+ item);
            if(photos.indexOf(item) > -1){
               // alert("getPortrait: portrait="+ "http://" + SERVER2 + "/TestFileUpload/uploads/" + item);                
                portraitUrl= "http://" + SERVER2 + "/TestFileUpload/uploads/" + item;
                return false;
            }
        }         
    }); 
    
    if(portraitUrl == null){
        portraitUrl = "images/default-portrait.png"; 
       // alert("getPortrait: portrait="+ "images/default-portrait.png");
    }
    return portraitUrl;
}

function onActionSheetOpen(e){
   // alert("onActionSheetOpen");
    var ctx = e.context;
    var indx = ctx.lastIndexOf("|");
    var type = ctx.substr(indx+1);
    var name = ctx.substr(0, indx);
   // alert("onActionSheetOpen: name="+name+",type="+type);    
    
    getActiveItem(name, type);
}



function mouseover(elm){
  //  alert("mouseover");
    kendo.fx(elm).zoom("out").startValue(2).endValue(1).play();
}

function mouseout(elm){
  //  alert("mouseout");
    
    kendo.fx(elm).zoom("in").startValue(1).endValue(2).play();
 }





