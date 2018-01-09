import React from 'react';
import { Segment, Header, Progress, Loader } from 'semantic-ui-react'

export default function LoadingView({ state }) {
    const showLoading = Object.values(state).filter(s => s.status === 'downloading').length > 0;
    const progress = showLoading
        ? Object.values(state).reduce((t, s) => (
            s.status === 'downloading' ? {
                total: t.total + s.progress.size.total,
                transferred: t.transferred + s.progress.size.transferred
            } : t
        ), { total: 0, transferred: 0 })
        : null;
    const progressElement = showLoading
        ? <Progress percent={(parseFloat(progress.transferred) / progress.total * 100).toFixed(2)} indicating />
        : null;
    return (
        <Segment basic className='loadview' textAlign='center'>
            <Header as='h2' icon>
                <Loader size='huge' active inline='centered' className='mainloader' />
                Checking system and downloading content
                <Header.Subheader>
                    It only happens once, but might take a while. <br/>
                    Meanwhile, make sure that your router has <br/>
                    <b>15600 and 16600 TCP</b> ports open and forwarded <br/>
                    as well as <b>14600 UDP</b>.
                </Header.Subheader>
            </Header>
            {progressElement}
        </Segment>
    )
}
