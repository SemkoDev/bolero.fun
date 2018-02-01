import React, { Component } from 'react';
import { Segment, Header, Icon, List } from 'semantic-ui-react'
import ErrorView from './ErrorView'
import LoadingView from './LoadingView'

export default class StateView extends Component {
    constructor(params) {
        super(params);
        this.state = {
            copiedAddress: 0
        };

    }

    render () {
        const { state } = this.props;
        if (state.iri && state.nelson && state.nelson.status !== 'running' && state.iri.status !== 'running' && Object.values(state).filter(s => s.status === 'error').length > 0) {
            return <ErrorView state={state} />
        }
        if (Object.values(state).filter(s => ['checking', 'downloading', 'waiting'].includes(s.status)).length) {
            return <LoadingView state={state} />
        }

        if (!state.iri) {
            return <div>&nbsp;</div>
        }

        const localAddress = 'http://localhost:14265';

        const isIRISyncronized = state.iri.status === 'running' &&
            state.iri.info.latestSolidSubtangleMilestoneIndex > 338000 &&
            state.iri.info.latestSolidSubtangleMilestoneIndex === state.iri.info.latestMilestoneIndex;
        const isIRISyncronizedText = isIRISyncronized
            ? 'Yes'
            : (
                state.iri && state.iri.info && state.iri.info.latestSolidSubtangleMilestoneIndex &&
                state.iri.info.latestSolidSubtangleMilestoneIndex > 338000 &&
                Math.abs(state.iri.info.latestSolidSubtangleMilestoneIndex - state.iri.info.latestMilestoneIndex) < 600
            )
                ? 'Almost'
                : 'No';
        const iriMilestones = state.iri.status === 'running'
            ? `(${state.iri.info.latestSolidSubtangleMilestoneIndex}/${state.iri.info.latestMilestoneIndex})`
            : '';


        return (
            <Segment basic>
                <Segment basic textAlign='center'>
                    <Header as='h2' icon color='green'>
                        <Icon name='lab' />
                        CarrIOTA Bolero
                        <Header.Subheader>
                            Spreading IOTA Nodes like wildfire!
                        </Header.Subheader>
                    </Header>
                </Segment>
                <List divided relaxed>
                    <List.Item>
                        <List.Icon name='heartbeat' size='large' verticalAlign='middle' />
                        <List.Content>
                            <List.Header>IRI Status</List.Header>
                            <List.Description>{state.iri.status === 'running' ? 'Running' : 'Not running'}</List.Description>
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name='wifi' size='large' verticalAlign='middle' />
                        <List.Content>
                            <List.Header>IRI Synchronized?</List.Header>
                            <List.Description>{isIRISyncronizedText}&nbsp;{iriMilestones}</List.Description>
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name='sitemap' size='large' verticalAlign='middle' />
                        <List.Content>
                            <List.Header>IRI Neighbors</List.Header>
                            <List.Description>{state.iri.status === 'running' ? state.iri.info.neighbors : 0}</List.Description>
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name='heartbeat' size='large' verticalAlign='middle' />
                        <List.Content>
                            <List.Header>Nelson Status</List.Header>
                            <List.Description>{state.nelson.status === 'running' ? 'Running' : 'Not running'}</List.Description>
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name='heartbeat' size='large' verticalAlign='middle' />
                        <List.Content>
                            <List.Header>
                                Full Node URL for your wallet
                                ({
                                this.state.copiedAddress > 0
                                    ? `Copied [${this.state.copiedAddress}]`
                                    : 'Click to copy'
                            })
                            </List.Header>
                            <List.Description as='a' onClick={() => this.copyAddress(localAddress)}>
                                {state.iri.status === 'running' ? localAddress : '...'}
                            </List.Description>
                        </List.Content>
                    </List.Item>
                </List>
            </Segment>
        )
    }

    copyAddress (localAddress) {
        window.clipboard.writeText(localAddress);
        window.clipboard.writeText(localAddress, 'selection');
        this.setState({
            copiedAddress: this.state.copiedAddress + 1
        });
    }
}