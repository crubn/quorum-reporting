import Collapse from '@material-ui/core/Collapse'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import { makeStyles } from '@material-ui/core/styles'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import StorageIcon from '@material-ui/icons/Storage'
import React from 'react'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: { paddingLeft: theme.spacing(4) },
}))

const varToTitle = (v) => {
    try {
        return v.replace(/_/g, '').replace(/([A-Z])/g, ' $1').replace(/^./, (str) => { return str.toUpperCase() })
    } catch (e) {
        return v
    }
}

export default function ListMakerArray({ type, title, list, accordionTitle }) {
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)

    const handleClick = () => {
        setOpen(!open)
    }

    return (
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={type === 'none' ? (<></>) : (
                <ListSubheader style={{ color: 'black' }}>
                    <strong>
                        {type}
                        {' '}
                        Name:
                        {' '}
                    </strong>
                    {title}
                </ListSubheader>
            )}
            className={classes.root}
        >

            <ListItem button onClick={handleClick}>
                <ListItemIcon>
                    <StorageIcon />
                </ListItemIcon>
                <ListItemText primary={accordionTitle} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {list.map((item, i) => (
                        <ListItem key={item} className={classes.nested}>
                            <ListItemIcon>
                                <ArrowRightIcon />
                            </ListItemIcon>
                            <ListItemText primary={varToTitle(item)} />
                        </ListItem>
                    ))}
                </List>
            </Collapse>
        </List>
    )
}
