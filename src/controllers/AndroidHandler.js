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
        case 'open_landing_page':
            openLandingPage();
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

function openLandingPage() {
    alert("Opening landing page");
    window.Android?.openLandingPage('Open landing page');
}

function saveCredentials(email, password) {
    alert("saving credentials on android");
    window.Android?.saveCredentials('Storing', email, password);
}