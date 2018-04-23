import { Component, Prop, State, Watch, Method, Element } from '@stencil/core';
import { Message } from '../models/message-model';

@Component({
    tag: 'chat-bob',
    styleUrl: 'chat-bob-component.scss'
})
export class ChatBob {

    @Prop() name: string;
    @Prop() callback: (message: Message) => void;
    @State() messages: Message[];
    @State() value: string;
    @State() minimized: boolean;
    @State() notifications: number;
    @State() typing: boolean;

    @Element() chatEl: HTMLElement;

    timer: number;

    constructor() {
        this.messages = [];
        this.minimized = true;
        this.notifications = 0;
    }

    @Watch('name')
    validateName(newValue: string) {
        const isBlank = typeof newValue == null;
        const atLeast2chars = typeof newValue === 'string' && newValue.length >= 2;
        if (isBlank) { throw new Error('name: required') };
        if (!atLeast2chars) { throw new Error('name: atLeast2chars') };
    }

    @Method()
    getMessages(): Message[] {
        return this.messages;
    }

    @Method()
    scrollToBottom() {
        setTimeout(() => {
            const chatList = this.getChatList();
            chatList.scrollTop = chatList.scrollHeight;
        });
    }

    private getChatList(): Element {
        return this.chatEl.querySelector('.chat-history');
    }

    componentDidLoad() {
        this.typing = true;
        this.timer = window.setTimeout(() => {
            this.addMessage(new Message(new Date, this.name, `Bonjour, mon nom est ${this.name}. Puis-je vous aider ?`));
            this.typing = false;
        }, 10000);
    }

    componentDidUnload() {
        window.clearTimeout(this.timer);
    }

    private addMessage(newMessage: Message) {
        this.messages = [...this.messages, newMessage];
        this.scrollToBottom();
        if (this.minimized) {
            this.notifications += 1;
        }
        if (this.callback) {
            this.callback(newMessage);
        }
    }

    handleSubmit(event) {
        event.preventDefault()
        if (this.value) {
            this.addMessage(new Message(new Date, 'Moi', this.value, 'User'));
            this.value = '';
        }
    }

    handleChange(event) {
        this.value = event.target.value;
    }

    toggleMinimization() {
        this.minimized = !this.minimized;
        if (!this.minimized) {
            this.notifications = 0;
        }
    }

    render() {
        return (
            <div id="live-chat">

                <header class="clearfix" onClick={() => this.toggleMinimization()}>

                    <a href="#" class="chat-close">x</a>

                    <h4>{this.name}</h4>

                    {this.notifications > 0 ? <span class="chat-message-counter">{this.notifications}</span> : ''}

                </header>

                <div class={'chat ' + (this.minimized ? 'minimized' : '')}>

                    <div class="chat-history">

                        { this.messages.map(message => (
                            <div class="chat-message clearfix">

                                <img src="http://gravatar.com/avatar/2c0ad52fc5943b78d6abe069cc08f320?s=32" alt="" width="32" height="32" />

                                <div class="chat-message-content clearfix">

                                    <span class="chat-time">{message.date}</span>

                                    <h5>{message.userName}</h5>

                                    <p>{message.content}</p>

                                </div>
                                <hr />
                            </div>
                            
                        ))}

                    </div>

                    <p class={'chat-feedback ' + (this.typing ? '' : 'hidden')}>{this.name} est en train de tapper…</p>

                    <form onSubmit={(e) => this.handleSubmit(e)}>

                        <fieldset>

                            <input required type="text" placeholder="Ecrivez votre message…" value={this.value} onInput={(event) => this.handleChange(event)} />

                        </fieldset>

                    </form>

                </div>

            </div>

        );
    }
}
