export class Message {

    public date: string;
    public userName: string;
    public content: string;
    public type: 'External' | 'User'

    constructor(date: Date, userName: string, content: string, type: 'External' | 'User' = 'External') {
        this.date = `${date.getHours()}:${date.getMinutes()}`;
        this.userName = userName;
        this.content = content;
        this.type = type;
    }

}
