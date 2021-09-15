import { Collapse } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import Alert from '@material-ui/lab/Alert'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getSingleTransaction } from '../client/fetcher'
import ListMaker from '../components/listMakerJSON'

const useStyles = makeStyles((theme) => ({
  root: { width: '100%', margin: '1em' },
  grid: {
    maxWidth: 1080,
    margin: '0 auto',
  },
  alert: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    margin: '1em'
  },
  title: {
    padding: 12,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  table: {},
}))

export default function TransactionDetail({ id }) {
  const classes = useStyles()
  const [transaction, setDisplayData] = useState()
  const [errorMessage, setErrorMessage] = useState()
  const { rpcEndpoint } = useSelector((state) => state.system)
  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  useEffect(() => {
    setDisplayData(undefined)
    getSingleTransaction(id)
      .then((res) => {
        console.log(res)
        setDisplayData(res)
  })
      .catch((e) => {
    setErrorMessage(`Transaction not found (${e.message})`)
    setDisplayData(undefined)
  })
}, [id, rpcEndpoint])

return (
  <div className={classes.root}>
    <Grid
      container
      direction="row"
      justify="center"
      className={classes.grid}
      alignItems="stretch"
    >
      {errorMessage
        && (
          <Grid item xs={12}>
            <Alert severity="error" className={classes.alert}>{errorMessage}</Alert>
          </Grid>
        )}
      {transaction
        && (
          <Grid item xs={12}>
            <Card className={classes.details}>
              <CardContent>
                <Typography variant="h6" className={classes.title}>
                  Transaction:&nbsp;
                  {id}
                </Typography>
                <TableContainer>
                  <Table className={classes.table} aria-label="simple table">
                    <TableBody>
                      <TableRow key="from">
                        <TableCell width="25%" size="small">From</TableCell>
                        <TableCell align="left" padding="default" data-value={transaction.from}>
                        {transaction.parsedData._orgId && `${transaction.parsedData._orgId}: `}
                          <Link to={`/contracts/${transaction.from}`}>{transaction.from}</Link>

                        </TableCell>
                      </TableRow>
                      {transaction.to
                        && transaction.to !== '0x0000000000000000000000000000000000000000'
                        && (
                          <TableRow key="to">
                            <TableCell width="25%" size="small">To</TableCell>
                            <TableCell align="left" padding="default" data-value={transaction.to}>
                              <Link to={`/contracts/${transaction.to}`}>{transaction.to}</Link>
                            </TableCell>
                          </TableRow>
                        )}
                      <TableRow key="parsedData">
                        <TableCell width="25%" size="small">Parsed Data</TableCell>
                        <TableCell
                          align="left"
                          padding="default"
                          data-value={transaction.parsedData}
                          style={{
                            whiteSpace: 'normal',
                            wordWrap: 'break-word'
                          }}
                        >
                          {transaction.parsedData ? (
                            <ListMaker
                              title="Parsed Data"
                              data={transaction.parsedData}
                            />
                          ) : ''}
                        </TableCell>
                      </TableRow>
                      <TableRow onClick={handleClick} style={{ cursor: 'pointer' }} key="details">
                        <TableCell width="25%" size="small">

                          <strong> More Details</strong>
                        </TableCell>
                        <TableCell
                          align="right"
                          padding="default"
                          data-value="More Details"
                          style={{
                            whiteSpace: 'normal',
                            wordWrap: 'break-word'
                          }}
                        >
                          {open ? <ExpandLess /> : <ExpandMore />}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <Table className={classes.table} aria-label="simple table">
                      <TableBody>
                        {transaction.createdContract
                          && transaction.createdContract !== '0x0000000000000000000000000000000000000000'
                          && (
                            <TableRow key="createdContract">
                              <TableCell width="25%" size="small">Created Contract</TableCell>
                              <TableCell
                                align="left"
                                padding="default"
                                data-value={transaction.createdContract}
                              >
                                <Link
                                  to={`/contracts/${transaction.createdContract}`}
                                >
                                  {transaction.createdContract}
                                </Link>
                              </TableCell>
                            </TableRow>
                          )}
                        <TableRow key="value">
                          <TableCell width="25%" size="small">Value</TableCell>
                          <TableCell
                            align="left"
                            padding="default"
                            data-value={transaction.value}
                          >
                            {transaction.value}
                          </TableCell>
                        </TableRow>
                        <TableRow key="gas">
                          <TableCell width="25%" size="small">Gas</TableCell>
                          <TableCell
                            align="left"
                            padding="default"
                            data-value={transaction.gas}
                          >
                            {transaction.gas}
                          </TableCell>
                        </TableRow>
                        <TableRow key="gasPrice">
                          <TableCell width="25%" size="small">Gas Price</TableCell>
                          <TableCell
                            align="left"
                            padding="default"
                            data-value={transaction.gasPrice}
                          >
                            {transaction.gasPrice}
                          </TableCell>
                        </TableRow>
                        <TableRow key="data">
                          <TableCell width="25%" size="small">Data</TableCell>
                          <TableCell
                            align="left"
                            padding="default"
                            data-value={transaction.data}
                          >
                            {transaction.data}
                          </TableCell>
                        </TableRow>
                        <TableRow key="blockNumber">
                          <TableCell width="25%" size="small">Block Number</TableCell>
                          <TableCell
                            align="left"
                            padding="default"
                            data-value={transaction.blockNumber}
                          >
                            <Link
                              to={`/blocks/${transaction.blockNumber}`}
                            >
                              {transaction.blockNumber}
                            </Link>
                          </TableCell>
                        </TableRow>
                        <TableRow key="blockHash">
                          <TableCell width="25%" size="small">Block Hash</TableCell>
                          <TableCell
                            align="left"
                            padding="default"
                            data-value={transaction.blockHash}
                          >
                            {transaction.blockHash}
                          </TableCell>
                        </TableRow>
                        <TableRow key="status">
                          <TableCell width="25%" size="small">Status</TableCell>
                          <TableCell
                            align="left"
                            padding="default"
                            data-value={transaction.status}
                          >
                            {transaction.status ? 1 : 0}
                          </TableCell>
                        </TableRow>
                        <TableRow key="nonce">
                          <TableCell width="25%" size="small">Nonce</TableCell>
                          <TableCell
                            align="left"
                            padding="default"
                            data-value={transaction.nonce}
                          >
                            {transaction.nonce}
                          </TableCell>
                        </TableRow>
                        <TableRow key="index">
                          <TableCell width="25%" size="small">Index</TableCell>
                          <TableCell align="left" padding="default" data-value={transaction.index}>
                            {transaction.index}
                          </TableCell>
                        </TableRow>

                        <TableRow key="parsedEvents">
                          <TableCell width="25%" size="small">Events</TableCell>
                          <TableCell
                            align="left"
                            padding="default"
                            data-value={transaction.parsedEvents}
                          >
                            {transaction.parsedEvents ? transaction.parsedEvents.length : ''}
                          </TableCell>
                        </TableRow>
                        <TableRow key="cumulativeGasUsed">
                          <TableCell width="25%" size="small">Cumulative Gas Used</TableCell>
                          <TableCell
                            align="left"
                            padding="default"
                            data-value={transaction.cumulativeGasUsed}
                          >
                            {transaction.cumulativeGasUsed}
                          </TableCell>
                        </TableRow>
                        <TableRow key="gasUsed">
                          <TableCell width="25%" size="small">Gas Used</TableCell>
                          <TableCell align="left" padding="default" data-value={transaction.gasUsed}>
                            {transaction.gasUsed}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Collapse>

                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
    </Grid>
  </div>
)
}
