export default { 
    header: 'Join RYPE',
    form: {
        inputFirstNameText: 'Please Enter your first name',
        inputLastNameText: 'Please Enter your last name',
        button: 'Button Text',
        labelName: 'Name:',
        labelLastName: 'Last Name',
        email: 'Please enter your email',
        password: 'Please enter password',
        passwordConfirm: 'Please confirm password',
        labelEmail: 'Email:',
        labelPassword: 'Password:',
        labelConfirmPassword: 'Confirm password:',
        apiUrl: `${location.protocol}//${location.hostname.indexOf('localhost') === -1 ? 'rype-api.herokuapp.com' : 'localhost:9000'}`
    }
};