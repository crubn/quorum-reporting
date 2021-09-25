import Tooltip from '@material-ui/core/Tooltip'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import React from 'react'

export default function CustomTooltip({ text, children }) {
    return (
        <>
            {children}
            <Tooltip title={(<span style={{ fontSize: '1.4em' }}>{text}</span>)} placement="right" arrow>

                <InfoIcon style={{ fontSize: '1.5em', position: 'relative', color: 'grey', top: '5px', margin: '0 2px' }} />

            </Tooltip>
        </>
    )
}
