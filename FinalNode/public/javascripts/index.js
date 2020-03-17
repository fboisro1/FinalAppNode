let payRate = 0.00;
let hours = 0.0;
let r;
let n = "";
let userArray = [];


var UserObj = function (pUserWage, pUserHours, pName) {
    this.UserWage = pUserWage;
    this.UserHours = pUserHours;
    this.Name = pName;
    this.ID = userArray.length + 1;
    
}

userArray.push(new UserObj(25, 84, "Sefu Kaba"));
userArray.push(new UserObj(27, 86, "Roofus"));
userArray.push(new UserObj(28, 85, "Roody"));

    
    document.addEventListener("DOMContentLoaded", function(){

        document.getElementById("buttonSave").addEventListener("click", function () {
            addNewUSer(new UserObj(document.getElementById("wages").value, 
            document.getElementById("hours").value, 
            document.getElementById("name").value));
            
        });



          var el = document.getElementById("sortByWages");
          if(el){
            el.addEventListener("click", function () {
              userArray = userArray.sort(compareWage);
              createList();
            });
          };

        document.getElementById("sortByName").addEventListener("click", function(){
            userArray = userArray.sort(compareName);    
            createList();
          });


            // delete button  Had trouble with spaces in titles, its an easy thing to fix
        // I just didn't get the time
        document.getElementById("buttonDelete").addEventListener("click", function () 
        {
        let deleteName = document.getElementById("deleteName").value;

        // doing the call to the server right here
        fetch('users/deleteName/' + deleteName , {
        // users/deleteName/Moonstruck   for example, this is what the URL looks like sent over the network
        method: 'DELETE'
        })  
        // now wait for 1st promise, saying server was happy with request or not
        .then(responsePromise1 => responsePromise1.text()) // ask for 2nd promise when server is node
        .then(responsePromise2 =>  console.log(responsePromise2), document.location.href = "index.html#listPage")  // wait for data from server to be valid
        // force jump off of same page to refresh the data after delete
        .catch(function (err) {
            console.log(err);
            alert(err);
          });
            FillArrayFromServer();
        });

        document.getElementById("calculate").addEventListener("click", function(){
            calcValues();
        });

        document.getElementById("addNewUser").addEventListener( "click", function(){
            let newUser = new UserObj(document.getElementById("name").value,
            document.getElementById("hours").value,
            document.getElementById("wages").value);
            addNewUSer(newUser);

            //location.href = "#inputPage";
        });
               
        //need this for when I go back to list page
        $(document).on("pagebeforeshow", "#listPage", function (event) {   // have to use jQuery 
        document.getElementById("results").value;
        document.getElementById("username").value;
        FillArrayFromServer(); //gets fresh data
        //createList();
        
        });
        
        // leaving lastPage to force the pagebeforeshow on lastPage from within that page when delete
        $(document).on("pagebeforeshow", "#lastPage", function(event){
          document.location.href = "index.html#resultsPage";
        });
          

        $(document).on("pagebeforeshow", "resultsPage", function (event) {   // have to use jQuery 
        let localID =  document.getElementById("IDparmHere").innerHTML;
        for(let i=0; i < userArray.length; i++){
          if(userArray[i].ID == localID){
            document.getElementById("oneName").innerHTML = "Your name is: " + userArray[userArray.length - 1].Name;
            document.getElementById("oneWage").innerHTML = "Your wages are: " + userArray[userArray.length - 1].UserWage;
            document.getElementById("oneHours").innerHTML = "You have worked " + userArray[userArray.length - 1].UserHours;
            break;
          }
        }
        
      });

    });
          
// var bla = $('#txt_name').val();


function compareWage(a, b) {
    
    const wageA = a.UserWage;
    const wageB = b.UserWage;
  
    let comparison = 0;
    if (wageA > wageB) {
      comparison = 1;
    } else if (wageA < wageB) {
      comparison = -1;
    }
    return comparison;
  }

  function compareName(a, b) {
    // Use toUpperCase() to ignore character casing
    const nameA = a.Name.toUpperCase();
    const nameB = b.Name.toUpperCase();
  
    let comparison = 0;
    if (nameA > nameB) {
      comparison = 1;
    } else if (nameA < nameB) {
      comparison = -1;
    }
    return comparison;
  }

  

function calcValues() {
    var num1 = $('#hours').val(); // gets input
    var num2 = $('#wages').val();
    n = $('#name').val();

    payRate = num1; //sets the global variable payRate to user input 
    hours = num2;
     


    num1 = Number(document.formcalc.hours.value);
    num2 = Number(document.formcalc.wages.value);
    var results = num1 * num2;
    r = results;
    document.getElementById("results").innerHTML = results;
    document.getElementById("username").innerHTML = n;
 
    console.log("Message: " + " " + n + " " + payRate + " "+ hours + " " + r);
   

   
};

//Mesh Save and Calc button



function createList()
{
  // clear prior data
  var divUserList = document.getElementById("divUserList");
  while (divUserList.firstChild) {    // remove any old data so don't get duplicates
  divUserList.removeChild(divUserList.firstChild);
  };

  var ul = document.createElement('ul');  
  console.log(userArray);
  userArray.forEach(function (element) {   // use handy array forEach method
    var li = document.createElement('li');
    li.innerHTML = "<a data-transition='pop' class='oneList' data-parm=" + element.ID + "  href='#listPage'> Get Details </a> " + element.ID + ":  " + "UserName: "+ element.Name + "    " + "Hours: " + element.UserHours + " " + "Wages: " + element.UserWage;
    ul.appendChild(li);
  });
  divUserList.appendChild(ul)

    //set up an event for each new li item, if user clicks any, it writes >>that<< items data-parm into the hidden html 
    var classname = document.getElementsByClassName("oneList");
    Array.from(classname).forEach(function (element) {
        element.addEventListener('click', function(){
            var parm = this.getAttribute("data-parm");  // passing in the record.Id
            //do something here with parameter on  pickbet page
            document.getElementById("IDparmHere").innerHTML = parm;
            document.location.href = "index.html#listPage";
        });
    });
   
};


// code to exchange data with node server
// ('/users/movieList'
function FillArrayFromServer(){
    // using fetch call to communicate with node server to get all data
    fetch('/users/userList') 
    .then(function (theResonsePromise) {  // wait for reply.  Note this one uses a normal function, not an => function
        return theResonsePromise.json();
    })
    .then(function (serverData) { // now wait for the 2nd promise, which is when data has finished being returned to client
    console.log(serverData);
    userArray.length = 0;  // clear array
    userArray = serverData;   // use our server json data which matches our objects in the array perfectly
    createList();  // placing this here will make it wait for data from server to be complete before re-doing the list
    })
    .catch(function (err) {
     console.log(err);
    });
};

function addNewUSer(newUser){
   
    // the required post body data is our user object passed in, newUser
    
    // create request object
    const request = new Request('/users/addNewUser', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    });
    
    // pass that request object we just created into the fetch()
    fetch(request)
        // wait for frist server promise response of "200" success (can name these returned promise objects anything you like)
        // Note this one uses an => function, not a normal function, just to show you can do either 
        .then(theResonsePromise => theResonsePromise.json())    // the .json sets up 2nd promise
        // wait for the .json promise, which is when the data is back
        .then(theResonsePromiseJson => console.log(theResonsePromiseJson), document.location.href = "#listPage" )
        // that client console log will write out the message I added to the Repsonse on the server
        .catch(function (err) {
            console.log(err);
        });
    
}; // end of addNewUser
    

