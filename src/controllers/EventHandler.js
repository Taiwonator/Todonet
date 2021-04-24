export function callEvent(event) {

    switch(event.name) {
        case 'hello':
            helloWorld();
            break;
        default:
            break;
    }
}

function helloWorld() {
    alert("Hello (from web)");
    showAndroidToast('Hello Android!');
}

function showAndroidToast(toast) {
    window.Android?.showToast(toast);
}

