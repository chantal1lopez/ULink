
const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';
const ADD_CHAT_NOTIFICATION = 'ADD_CHAT_NOTIFICATION';
const CLEAR_CHAT_NOTIFICATIONS = 'CLEAR_CHAT_NOTIFICATIONS';


const initialState = {
    hasNotification: false,
    hasChatNotification: false,
};

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_NOTIFICATION':
            return { ...state, hasNotification: true };
        case 'CLEAR_NOTIFICATIONS':
            return { ...state, hasNotification: false };
        case 'ADD_CHAT_NOTIFICATION':
            return { ...state, hasChatNotification: true };
        case 'CLEAR_CHAT_NOTIFICATIONS':
            return { ...state, hasChatNotification: false };
        default:
            return state;
    }
};

export const addNotification = () => ({
    type: ADD_NOTIFICATION,
});

export const clearNotifications = () => ({
    type: CLEAR_NOTIFICATIONS,
});

export const addChatNotification = () => ({
    type: ADD_CHAT_NOTIFICATION,
});

export const clearChatNotifications = () => ({
    type: CLEAR_CHAT_NOTIFICATIONS,
});


export default notificationReducer;
