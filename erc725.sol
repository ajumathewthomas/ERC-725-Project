
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.6.0;

// modules
import "./ERC725X.sol";
import "./ERC725Y.sol";

/**
 * @title ERC725 bundle
 * @dev Bundles ERC725X and ERC725Y together into one smart contract
 *
 *  @author AMT
 */
    contract ERC725 is ERC725X,ERC725Y{
    address founder;
    mapping(string => identity) identity_id;
    mapping(string => bool) public emailId;
    mapping(uint256 => bool) public contactNum;
    
    struct identity {
        
      
        
        string ssn_id;  //SSN Id (Unique Id)
        string name; // Name of the person
        string dob;  // Date of birth
        string gender; // Gender
        uint256 contact_no; // Contact No
        string email; // Email
        string blood_group; // Blood group
        string city; // City
        string state; //State
        string photoHash; // IPFS hash of photo
        string ltHash; // IPFS hash of Left thumb
        string rtHash; // IPFS hash of Right thumb
        string leHash; // IPFS hash of left eye
        string reHash; // IPFS hash of right eye
        
     }
    
    identity id;
    
    constructor() ERC725X(0xFE55a76947BC56e26E2995C8ED2cbBD3dfC69806) ERC725Y(0xFE55a76947BC56e26E2995C8ED2cbBD3dfC69806)  public{
        
         founder=msg.sender;  //Person who deploys this contract will be the owner
        
        }
    
    modifier isOwner() {

          
          require(msg.sender == founder, "Access is not allowed");

        _;
         
    }
    
    function setDetails(string memory _ssn_id,string memory _name,string memory _dob,string memory _gender,uint256 _contact_no,string memory _email,string memory _blood_group, string memory _city,string memory _state,string memory _photoHash,string memory _ltHash,string memory _rtHash,string memory _leHash,string memory _reHash) public {
    // Function for inputtng the information from the UI
   // _mint(msg.sender,_aadhar_id);
        require(!emailId[_email], 'Email Exists'); // Checks for email duplication
        require(!contactNum[_contact_no], 'Contact Number Exists'); // Checks for contact number duplication

        id.name = _name;  // assigning the name parameter
        id.dob =  _dob;  // assigns the date of birth paratmer obtained from UI
        id.gender = _gender; // assigns the gender parameter obtained from UI
        id.contact_no = _contact_no; //assigns the contact number obtained from UI
        id.email = _email;  //assigns email parameter obtained from UI
        id.blood_group = _blood_group; //Assigns blood_group value chosen from UI
        id.city = _city; // Assigns city value obtained from UI
        id.state = _state; //Assigns state value obtaine from UI
        id.photoHash = _photoHash; //assigns IPFS hash of Photo
        id.ltHash = _ltHash; // assigns IPFS hash of left thumb
        id.rtHash = _rtHash; // assigns IPFS hash of right thumb
        id.leHash = _leHash; // assigns IPFS hash of left eye
        id.reHash = _reHash; //assigns IPFS hash of right eye
        identity_id[_ssn_id]=id;   

        contactNum[_contact_no] = true;
        emailId[_email] = true;
    }

    function getuserDetails(string memory _ssn_id)public view returns(string memory,string memory,string memory,uint256,string memory,string memory,string memory){
        
        // Function for retrieving user information entered in the UI
    
        identity memory _id = identity_id[_ssn_id];
        return(_id.name,_id.dob,_id.gender,_id.contact_no,_id.email,_id.blood_group,_id.city);
    
        
    }

    function getUserfileDetails(string memory _ssn_id) public view returns(string memory,string memory,string memory,string memory,string memory,string memory){
        // Function for retrieving user information entered in the UI
        identity memory _id = identity_id[_ssn_id];
        return(_id.state,_id.photoHash,_id.ltHash,_id.rtHash,_id.leHash,_id.reHash);
        
    }

    
    // NOTE this implementation has not by default: receive() external payable {}
    
    
    
    
}
