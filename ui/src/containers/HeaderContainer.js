import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { Lens } from '@material-ui/icons'
import SettingsIcon from '@material-ui/icons/Settings'
import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getBlockNumber, getContracts } from '../client/fetcher'
import { setBaseUrl } from '../client/rpcClient'
import SearchField from '../components/SearchField'
import SettingForm from '../components/SettingForm'
import {
  connectAction,
  disconnectAction,
  getContractsAction,
  updateBlockNumberAction,
  updateEndpointAction
} from '../redux/actions/systemActions'
import logo from '../resources/quorum-logo.png'

const useStyles = makeStyles((theme) => ({
  grow: { flexGrow: 1 },
  home: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit',
    marginRight: 16,
  },
  homeText: {
    paddingLeft: 12,
    paddingRight: 12,
    fontSize: 20,
    lineHeight: 'normal',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
    margin: 12,
  },
  button: { color: theme.palette.primary.contrastText },
  // logo: {
  //   // backgroundColor: theme.palette.primary.contrastText
  // }

}))

export default function HeaderContainer() {
  const classes = useStyles()
  const [formIsOpen, setFormIsOpen] = useState(false)
  const [newRPCEndpoint, setNewRPCEndpoint] = useState('')
  const {
    rpcEndpoint,
    isConnected,
    lastPersistedBlockNumber,
  } = useSelector((state) => state.system, shallowEqual)
  const dispatch = useDispatch()

  useEffect(() => {
    getContracts()
      .then((contracts) => {
        dispatch(getContractsAction(contracts))
      })
      .catch((e) => {
        console.error('Could not fetch contracts', e)
      })
    const timerID = setInterval(
      () => connectReporting(),
      1000,
    )
    return () => {
      clearInterval(timerID)
    }
  }, [rpcEndpoint])

  const connectReporting = () => {
    getBlockNumber()
      .then((res) => {
        if (lastPersistedBlockNumber !== res) {
          if (!isConnected) {
            dispatch(connectAction())
          }
          dispatch(updateBlockNumberAction(res))
        }
      })
      .catch((e) => {
        if (isConnected) {
          console.error('Could not get latest block number, disconnecting.', e)
          dispatch(disconnectAction())
          dispatch(updateBlockNumberAction(undefined))
        }
      })
  }

  return (
    <AppBar color="transparent" position="static">
      <Toolbar>
        <Link to="/" className={classes.home}>
          {/* eslint-disable-next-line global-require */}
          <img src={logo} className={classes.logo} width="40" height="20" alt="" />
          <Typography className={classes.homeText}>
            E-GP BLOCKCHAIN REPORTING
          </Typography>
        </Link>
        <span className={classes.grow} />
        <SearchField />
        <Lens
          style={{
            fontSize: 16,
            color: isConnected ? '#15db47' : 'red',
            margin: 6,
          }}
        />
        <Typography variant="h5" color="inherit">
          {isConnected ? (`#${lastPersistedBlockNumber}`) : '#N/A'}
          &nbsp;
        </Typography>
        <IconButton variant="h4" onClick={() => setFormIsOpen(true)}>
          <SettingsIcon color="action" />
        </IconButton>
        <SettingForm
          rpcEndpoint={rpcEndpoint}
          isOpen={formIsOpen}
          handleCloseSetting={() => setFormIsOpen(false)}
          handleRPCEndpointChange={(e) => setNewRPCEndpoint(e.target.value)}
          handleSetRPCEndpoint={() => {
            setBaseUrl(newRPCEndpoint)
            dispatch(updateEndpointAction(newRPCEndpoint))
            connectReporting()
            setFormIsOpen(false)
          }}
          newRPCEndpoint={newRPCEndpoint}
        />
      </Toolbar>
    </AppBar>
  )
}
