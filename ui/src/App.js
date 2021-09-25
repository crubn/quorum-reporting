import CircularProgress from '@material-ui/core/CircularProgress'
import makeStyles from '@material-ui/core/styles/makeStyles'
import React from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import BlockDetail from './containers/BlockDetail'
import ContractDetail from './containers/ContractDetail'
import ContractListContainer from './containers/ContractListContainer'
import HeaderContainer from './containers/HeaderContainer'
import TransactionDetail from './containers/TransactionDetail'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f2f2f4',
    minHeight: '100vh'
  },
  loading: { margin: 24 },
}))

function App() {
  const classes = useStyles()
  const ready = useSelector((state) => state.system.isConnected && state.system.lastPersistedBlockNumber !== undefined)
  return (
    <Router>
      <div className={classes.root}>
        <HeaderContainer />
        {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
        {!ready && <CircularProgress className={classes.loading} />}
        {ready
        && (
          <Switch>
            <Route
              path="/blocks/:id"
              render={({ match }) => <BlockDetail number={match.params.id} />}
            />
            <Route
              path="/transactions/:id"
              render={({ match }) => <TransactionDetail id={match.params.id} />}
            />
            <Route
              path="/contracts/:id"
              render={({ match }) => <ContractDetail address={match.params.id} />}
            />

            <Route path="/">
              <ContractListContainer />
            </Route>
          </Switch>
        )}
      </div>
    </Router>
  )
}

export default App
