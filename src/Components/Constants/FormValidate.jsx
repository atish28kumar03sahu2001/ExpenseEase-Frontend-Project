// src/Components/Constants/FormValidate.jsx
export const FormValidate = (formData) => {
    const {username, useremail, userpassword, confirmpassword} = formData;
    
    switch(true) {
        case !username:
            return {isValid: false, message: "Please Fill In The User Name Field"};
        case !useremail:
            return {isValid: false, message: "Please Fill In The User Email Field"};
        case !userpassword:
            return {isValid: false, message: "Please Fill In The User Password Field"};
        case !confirmpassword:
            return {isValid: false, message: "Please Fill In The Confirm Password Field"};
        case userpassword !== confirmpassword:
            return {isValid: false, message: "Passwords Do Not Match"};
        default:
            return {isValid: true, message: ""};
    }
}

export const extractUserName = (email) => {
    return email.split('@')[0];
}