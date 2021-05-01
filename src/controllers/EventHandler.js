import { detailsEventHandler } from './DetailsEventHandler';

export function eventCall(event) {

    switch(event.type) {
        case 'ANDROID':
            androidEventHandler(event);
            break;
        case 'DETAILS':
            detailsEventHandler(event);
            break;
        case 'TODOS':
            todosEventHandler(event);
            break;
        case 'FRIENDS':
            friendsEventHandler(event);
            break;
        case 'ACTIVITIES':
            activitiesEventHandler(event);
            break;
        default:
            break;
    }

}

function androidEventHandler(event) {

    switch(event.name) {
        case 'hello':
            helloWorld();
            break;
        default:
            break;
    }

}

function todosEventHandler(event) {

}

function friendsEventHandler(event) {

}

function activitiesEventHandler(event) {

}



function helloWorld() {
    alert("Hello (from web)");
    showAndroidToast('Hello Android!');
}

function showAndroidToast(toast) {
    window.Android?.showToast(toast);
}

// Event type: ANDROID, DETAILS, TODOS, FRIENDS, ACTIVITIES
