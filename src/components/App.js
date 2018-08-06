import React, { Component } from 'react';
import { Sidebar, Segment, Menu } from 'semantic-ui-react';
import copy from 'copy-to-clipboard';
import StateView from './views/StateView';
import LogView from './views/LogView';
import SettingsView from './views/SettingsView';
import StatusIcon from './icons/StatusIcon';
import PopupMenuIcon from './icons/PopupMenuIcon';

import 'semantic-ui-css/semantic.min.css';
import '../assets/css/App.css';
import ErrorView from "./views/ErrorView";

const DONATE_ADDR = 'YHZIJOENEFSDMZGZA9WOGFTRXOFPVFFCDEYEFHPUGKEUAOTTMVLPSSNZNHRJD99WAVESLFPSGLMTUEIBDZRKBKXWZD';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLog: false,
            showSettings: false
        };
    }

    componentWillMount () {
        const { requestUpdate } = this.props;
        setInterval(requestUpdate, 500)
    }

    componentWillUnmount () {
        const { requestUpdate } = this.props;
        clearInterval(requestUpdate)
    }

    render() {
        const {
            iri = { status: 'waiting' },
            nelson = { status: 'waiting' },
            field = { status: 'waiting' },
            database = { status: 'waiting' },
            system = { status: 'waiting' },
        } = this.props.state;
        const copyAddress = () => {
            this.copied = true;
            this.setState({ copied: {} });
            copy(DONATE_ADDR);
        };
        let view = null;
        if (this.props.error) {
            view = <ErrorView message='Could not connect to Bolero! It might have crashed. Please try restarting Bolero.' />
        } else if (this.state.showLog) {
            view = <LogView messages={this.props.messages} />
        } else if (this.state.showSettings) {
            view = <SettingsView
              saving={this.props.saving}
              settings={this.props.settings}
              updateSettings={this.props.updateSettings} />
        } else {
          view = <StateView state={this.props.state} />
        }

        return (
            <Sidebar.Pushable as={Segment} className='wrapper'>
                <Sidebar as={Menu} animation='overlay' direction='bottom' visible={true} inverted>
                    <StatusIcon component='System' state={system} />
                    <StatusIcon component='Database' state={database} />
                    <StatusIcon component='IRI' state={iri} />
                    <StatusIcon component='Nelson' state={nelson} />
                    <StatusIcon component='Field' state={field} />
                    <PopupMenuIcon
                        text={'Log'}
                        color={this.state.showLog ? 'green' : null}
                        icon={'bell'}
                        popupText={this.state.showLog ? 'Hide Log' : 'Show Log'}
                        onClick={() => this.setState({
                          showLog: !this.state.showLog,
                          showSettings: false
                        })} />
                    <PopupMenuIcon
                        text={'Settings'}
                        color={this.state.showSettings ? 'green' : null}
                        icon={'cogs'}
                        popupText={this.state.showSettings ? 'Hide Settings' : 'Show Settings'}
                        onClick={() => this.setState({
                          showSettings: !this.state.showSettings,
                          showLog: false
                        })} />
                    <PopupMenuIcon
                        text={'Donate'}
                        color={'red'}
                        icon={'heart'}
                        popupText={this.copied ? 'Copied! (click to copy again)' : 'Click to copy address'}
                        onClick={copyAddress} />
                </Sidebar>
                <Sidebar.Pusher>
                  {view}
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        );
    }
}

export default App;
