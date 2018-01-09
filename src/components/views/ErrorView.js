import React from 'react';
import { Segment, Header, Icon } from 'semantic-ui-react'

export default function ErrorView({ state }) {
    return (
        <Segment basic className='loadview' textAlign='center'>
            <Header as='h2' icon>
                <Icon name='frown' color='red' />
                Well, that's a bummer!
                <Header.Subheader>
                    Something went wrong. Please hover over the component buttons below for more info!
                </Header.Subheader>
            </Header>
        </Segment>
    )
}
