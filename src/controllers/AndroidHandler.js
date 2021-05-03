function androidEventHandler(event) {

    switch(event.name) {
        case 'message':
            androidMessage(event);
            break;
        default:
            break;
    }

}

function helloWorld() {
    alert("Hello (from web)");
    showAndroidToast('Hello Android!');
}

function androidMessage(event) {
    showAndroidToast(event.message);
}

function showAndroidToast(toast) {
    window.Android?.showToast(toast);
}