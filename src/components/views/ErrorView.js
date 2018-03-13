import React from 'react';
import { Segment, Header, Icon } from 'semantic-ui-react'
const DEFAULT_MESSAGE = 'Something went wrong. Please hover over the component buttons below for more info!'

export default function ErrorView({ state, message = DEFAULT_MESSAGE }) {
    return (
        <Segment basic className='loadview' textAlign='center'>
            <Header as='h2' icon>
                <Icon name='frown' color='red' />
                Well, that's a bummer!
                <Header.Subheader>
                  {message}
                </Header.Subheader>
            </Header>
        </Segment>
    )
}
