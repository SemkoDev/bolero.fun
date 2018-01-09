import React, { Component } from 'react';
import { Sidebar, Segment, Menu } from 'semantic-ui-react';
import StateView from './views/StateView';
import LogView from './views/LogView';
import StatusIcon from './icons/StatusIcon';
import PopupMenuIcon from './icons/PopupMenuIcon';

import 'semantic-ui-css/semantic.min.css';
import '../assets/css/App.css';

const DONATE_ADDR = 'SOZAIPJMQUBOFCTDTJJDXCZEKNIYZGIGVDLFMH9FFBAYK9SWGTBCWVUTFHXDOUESZAXRJJCJESJPIEQCCKBUTVQPOW';

class App extends Component {
    constructor(params) {
        super(params);
        this.state = {
            state: {},
            messages: [],
            showLog: false
        };
        window.ipcRenderer.on('state', (event, state) => {
            console.log('STATE', state);
            this.setState(state);
        });
        setInterval(() => {
            window.ipcRenderer.send('requestUpdate', 1);
        }, 3000);
    }

    render() {
        const {
            iri = { status: 'waiting' },
            nelson = { status: 'waiting' },
            database = { status: 'waiting' },
            system = { status: 'waiting' }
        } = this.state.state;
        const copyAddress = () => {
            this.copied = true;
            this.setState({ copied: {} });
            window.clipboard.writeText(DONATE_ADDR);
            window.clipboard.writeText(DONATE_ADDR, 'selection');
        };

        return (
            <Sidebar.Pushable as={Segment} className='wrapper'>
                <Sidebar as={Menu} animation='overlay' direction='bottom' visible={true} inverted>
                    <StatusIcon component='System' state={system} />
                    <StatusIcon component='Database' state={database} />
                    <StatusIcon component='IRI' state={iri} />
                    <StatusIcon component='Nelson' state={nelson} />
                    <PopupMenuIcon
                        text={'Log'}
                        color={this.state.showLog ? 'green' : 'white'}
                        icon={'bell'}
                        popupText={this.state.showLog ? 'Hide Log' : 'Show Log'}
                        onClick={() => this.setState({ showLog: !this.state.showLog })} />
                    <PopupMenuIcon
                        text={'Power Off'}
                        color={'green'}
                        icon={'power'}
                        popupText={'Shutdown Bolero'}
                        onClick={() => { window.ipcRenderer.send('shutdown', 1); }} />
                    <PopupMenuIcon
                        text={'Donate'}
                        color={'red'}
                        icon={'heart'}
                        popupText={this.copied ? 'Copied! (click to copy again)' : 'Click to copy address'}
                        onClick={copyAddress} />
                </Sidebar>
                <Sidebar.Pusher>
                    {
                        this.state.showLog
                            ? <LogView messages={this.state.messages} />
                            : <StateView state={this.state.state} />
                    }
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        );
    }
}

export default App;
