import Collapse from '@material-ui/core/Collapse'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import AssignmentReturnedIcon from '@material-ui/icons/AssignmentReturned'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import React, { useEffect } from 'react'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    nested: { paddingLeft: theme.spacing(4) },
}))

const varToTitle = (v) => {
    return v.replace(/_/g, '').replace(/([A-Z])/g, ' $1').replace(/^./, (str) => { return str.toUpperCase() })
}

export function NestedList({ title, children }) {
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)

    const handleClick = () => {
        // console.log(data)
        setOpen(!open)
    }

    return (
        <>

            <ListItem onClick={handleClick}>
                <ListItemIcon>
                    <AssignmentReturnedIcon />
                </ListItemIcon>
                <ListItemText primary={title} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse style={{ width: '100%' }} in={open} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
        </>
    )
}

export function ListMaker({ title, data }) {
    const classes = useStyles()
    // console.log(Object.keys(data))
    useEffect(() => { console.log(data) }, [])
    return (
        <>
            {data && Object.keys(data).map((x, i) => {
                if (data[x].constructor === Object) {
                    // console.log(`===========${i}`)
                    return (
                        <div key={`collapse-${i}`} style={{ marginLeft: '1em' }}>
                            <NestedList title={x}>
                                <ListMaker title={x} data={data[x]} />
                            </NestedList>
                        </div>
                    )
                }
                // return (<NestedList title={title} data={{ [x]: data[x] }} />)

                return (
                    <ListItem key={i} className={classes.nested}>
                        <ListItemIcon>
                            <ArrowRightIcon />
                        </ListItemIcon>
                        <ListItemText>
                            <strong>{`${varToTitle(x)}: `}</strong>
                            {/http/g.test(data[x]) ? (
                                <a
                                    href={data[x]}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {data[x]}
                                </a>
                            ) : <span>{data[x].toString()}</span>}
                        </ListItemText>
                    </ListItem>
                )
            })}
        </>
    )
}

export default function ListMakerWrapper({ title, data }) {
    const classes = useStyles()
    return (
        // <p>{JSON.stringify(data)}</p>
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.root}
        >
            <NestedList title={title}>
                {Object.keys(data).length <= 0
                    ? (
                        <ListItem className={classes.nested}>
                            <ListItemIcon>
                                <ArrowRightIcon />
                            </ListItemIcon>
                            <ListItemText>
                                No Data
                            </ListItemText>
                        </ListItem>
                    ) : <ListMaker title={title} data={data} />}

            </NestedList>
        </List>
    )
}
