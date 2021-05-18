export function androidEventHandler(event) {

    switch(event.name) {
        case 'message':
            androidMessage(event);
            break;
        case 'open_native_app':
            openNativeApp(event.email, event.password);
            break;
        case 'save_credentials':
            saveCredentials(event.email, event.password);
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
    // alert(event.message);
    showAndroidToast(event.message);
}

function showAndroidToast(toast) {
    window.Android?.showToast(toast);
}

function openNativeApp(email, password) {
    alert("opening native app");
    window.Android?.openNativeApp('Open native app', email, password);
}

function saveCredentials(email, password) {
    alert("saving credentials on android");
    window.Android?.openNativeApp('Storing', email, password);
}