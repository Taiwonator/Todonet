import { androidEventHandler } from './AndroidHandler';

export function eventCall(event) {

    switch(event.type) {
        case 'ANDROID':
            androidEventHandler(event);
            break;
        default:
            break;
    }

}
