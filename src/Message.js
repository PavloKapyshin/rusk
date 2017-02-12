const ERROR = "error";
const SUCCESS = "success";
const INFO = "info";


export default class Message {
    constructor(value, level) {
        this.value = value;
        this.level = level;
    }

    static error(value) {
        return new Message(value, ERROR);
    }

    static success(value) {
        return new Message(value, SUCCESS);
    }

    static info(value) {
        return new Message(value, INFO);
    }
}
