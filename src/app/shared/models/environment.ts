export class Environment{

    isOnLiveServer(){

        let url = window.location.href;
        let result = (url.indexOf("piras") > -1 || url.indexOf("registration")> -1);

        return result;
    }
}