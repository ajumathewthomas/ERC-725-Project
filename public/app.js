'use strict'

const IPFS = require('ipfs')  // importing IPFS package
const uint8ArrayConcat = require('uint8arrays/concat')
const all = require('it-all')
const abi = require('./assets/ContractAbi.json'); // ABIs are stored in a seperate JSON file. Importing ABIs
//const keccak256 = require('keccak256')


var node;
var photoMatrix = {}; // variable that holds the CIDs of photo,thumb impression and eyes
var account;

window.addEventListener('load', async () => {


  if (typeof window.ethereum !== 'undefined') {
    console.log("MetaMask is Available :) !");
  }

  // Modern DApp browsers
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);

    // To prevent the page reloading when the MetaMask network changes
    ethereum.autoRefreshOnNetworkChange = false;

    // To Capture the account details from MetaMask
    const accounts = await ethereum.enable();
    account = accounts[0];

  }
  // Legacy DApp browsers
  else if (window.web3) {
    //window.web3 = new Web3(web3.currentProvider);
    window.web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/cbd9dc11b30147e9a2cc974be655ef7c"));
  }
  // Non-DApp browsers
  else {
    console.log('Non-Ethereum browser detected. Please install MetaMask');
  }

});

var contractaddress = '0x9fb3c4587718B76ec3C2A06ec00C2b6185388191';

function set_details() {
  var myContract = new web3.eth.Contract(abi, contractaddress, { from: account, gasPrice: '5000000', gas: '5000000' });

  var name = document.getElementById("name").value;
  var dob = document.getElementById("birthday").value;
  var gender = document.getElementById("gender").value;
  var cnumber = document.getElementById("contact_no").value;
  var email = document.getElementById("email_id").value;
  var bgroup = document.getElementById("bloodgroup").value;
  var city = document.getElementById("city").value;
  var state = document.getElementById("state").value;
  var photo = photoMatrix['image'] ? photoMatrix['image'] : "";  // Conditional statement if id is present then CID of photo will be stored otherwise it will pass empty string
  var photo1 = photoMatrix['image1'] ? photoMatrix['image1'] : ""; // Conditional statement if id is present then CID of photo will be stored otherwise it will pass empty string
  var photo2 = photoMatrix['image2'] ? photoMatrix['image2'] : ""; // Conditional statement if id is present then CID of photo will be stored otherwise it will pass empty string
  var photo3 = photoMatrix['image3'] ? photoMatrix['image3'] : ""; // Conditional statement if id is present then CID of photo will be stored otherwise it will pass empty string
  var photo4 = photoMatrix['image4'] ? photoMatrix['image4'] : ""; // Conditional statement if id is present then CID of photo will be stored otherwise it will pass empty string
 // var ssnid = keccak256(email).toString('hex');
  var ssnid =  Math.floor(Math.random()*10000000).toString(); // Generates a random number and will be converted in the string format as string variable is declared in the contract

  myContract.methods.contactNum(cnumber).call(function (err, result) {
    // calls contactNum from the contract to check for duplicate entries in Phone No 
	if (err) { console.log(err); }
    if (!result) {
      myContract.methods.emailId(email).call(function (err, result) {
		  // calls email ID field from the contract to check for duplicate entries in Email 
        if (err) { console.log(err); }
        if (!result) {
          myContract.methods.setDetails(ssnid, name, dob, gender, cnumber, email, bgroup, city, state, photo, photo1, photo2, photo3, photo4).send(function (err, result) {
            if (err) { console.log(err); }
            if (result) {
              document.getElementById("result").innerHTML = result; //Prints the transaction ID genenrated once confirmed on metamask 
              document.getElementById("result4").innerHTML = ssnid; //Prints the Random number generated as Amrita ID
            }
          });
        } else {
          alert('Email used'); // Shows Alert if email already exists 
        }
      })
    } else {
      alert('Contact Number used'); //Pop up alert if contact number already exists
    }
  })
}
function show_details() {
	// Function called in to retrieve the information
  var myContract = new web3.eth.Contract(abi, contractaddress, { from: account, gasPrice: '5000000', gas: '500000' });
  var s_id = document.getElementById("ssn_id").value;
  var result = myContract.methods.getuserDetails(s_id).call(function (err, result) {

    if (err) { console.log(err); }
    if (result) {
		//Displays the information captured from the set details 
      document.getElementById("get_name").innerHTML = result[0]; 
      document.getElementById("get_dob").innerHTML = result[1];
      document.getElementById("get_gender").innerHTML = result[2];
      document.getElementById("get_number").innerHTML = result[3];
      document.getElementById("get_email").innerHTML = result[4];
      document.getElementById("get_bloodgroup").innerHTML = result[5];
      document.getElementById("get_city").innerHTML = result[6];
    }
  });
  
  myContract.methods.getUserfileDetails(s_id).call(function (err,fileDetails) {
    if (err) { console.log(err); }
    if (fileDetails) {
		//Displays State and Photos uploaded from the UI
      document.getElementById("get_state").innerHTML = fileDetails[0]; // Displays Photo by passing CID and image ID
      document.getElementById("get_photo").innerHTML = getFile(fileDetails[1], 'get_photo');  // Displays Photo by passing CID and image ID
      document.getElementById("get_leftThumb").innerHTML = getFile(fileDetails[2], 'get_leftThumb');  // Displays Photo by passing CID and image ID
      document.getElementById("get_rightThumb").innerHTML = getFile(fileDetails[3], 'get_rightThumb');  // Displays Photo by passing CID and image ID
      document.getElementById("get_leftEye").innerHTML = getFile(fileDetails[4], 'get_leftEye');  // Displays Photo by passing CID and image ID
      document.getElementById("get_rightEye").innerHTML = getFile(fileDetails[5], 'get_rightEye');  // Displays Photo by passing CID and image ID
    }
  });
}


async function uploadFile(file) {
	//Function to get the file uploaded from the UI
  const fileAdded = await node.add({
    path: file.name,
    content: file
  }, {
    wrapWithDirectory: true
  })
  return (fileAdded.cid.toString()); //Adds IPFS hash to the image uploaded 
}

async function getFile(cid, id) {
	//Function that accepts CID value and ID of the image for retrieval part

  for await (const file of node.get(cid)) {
    if (file.content) {
      const content = uint8ArrayConcat(await all(file.content))
      await appendFile(content, id)
    }
  }
}

function appendFile(data, id) {
  const file = new window.Blob([data], { type: 'application/octet-binary' })
  const url = window.URL.createObjectURL(file)
  document.getElementById(id).setAttribute('src', url);
}

async function catchFile(e, id) {
	//Function to get the file along with image ID
  photoMatrix[id] = await uploadFile(e.target.files[0]); // CID value will be appended to photomatrix variable
  console.log(photoMatrix); //Prints IPFS hash values 
}

async function start() {
  node = await IPFS.create(); //Creates a IPFS node 

  if (document.getElementById('image')) {
    document.getElementById("image").addEventListener("change", (e) => catchFile(e, 'image'));  //Listener looks for change and catches the ID of the image uploaded
    document.getElementById("image1").addEventListener("change", (e) => catchFile(e, 'image1')); //Listener looks for change and catches the ID of the image uploaded
    document.getElementById("image2").addEventListener("change", (e) => catchFile(e, 'image2')); //Listener looks for change and catches the ID of the image uploaded
    document.getElementById("image3").addEventListener("change", (e) => catchFile(e, 'image3')); //Listener looks for change and catches the ID of the image uploaded
    document.getElementById("image4").addEventListener("change", (e) => catchFile(e, 'image4'));//Listener looks for change and catches the ID of the image uploaded
    document.getElementById('submitBtnIndex').addEventListener("click", () => set_details());
  } else {
    document.getElementById('getDetailsBtn').addEventListener("click", () => show_details());
  }
}

start(); //Initial Start of the program