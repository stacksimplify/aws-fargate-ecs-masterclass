export const selectUser = (user) => {
    console.log("You clicked on user: ", user.first);
    return {
        type: 'USER_SELECTED',
        payload: user
    }
};

export const loginSuccess = (user) => {
    console.log("Logged In User: ", user.first);
    console.log("Login Success User Object: ", user);
    return {
        type: 'LOGIN_SUCCESS',
        payload: user
    }
};

export const logoutSuccess = () => {
    console.log("Logging User Out: ");
    return {
        type: 'LOGOUT_SUCCESS',
        payload: null
    }
};

export const setLoginSuccessRedirectUrl = (url) => {
    console.log("Storing url: ", url);
    return {
        type: 'LOGIN_SUCCESS_REDIRECT_URL',
        payload: url
    }
};
