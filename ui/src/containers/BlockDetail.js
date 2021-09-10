import React, { useEffect, useState } from 'react'
import Alert from '@material-ui/lab/Alert'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { getSingleBlock } from '../client/fetcher'

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

export default function BlockDetail({ number }) {
  const classes = useStyles()
  const [block, setBlock] = useState()
  const [errorMessage, setErrorMessage] = useState()

  useEffect(() => {
    setBlock(undefined)
    const blockNumber = parseInt(number, 10)
    getSingleBlock(blockNumber)
      .then((res) => setBlock(res))
      .catch((e) => {
        setErrorMessage(`Block not found (${e.message})`)
        setBlock(undefined)
      })
  }, [number])

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
        {block
        && (
          <Grid item xs={12}>
            <Card className={classes.details}>
              <CardContent>
                <Typography component="div" className={classes.title}>
                  Block
                  {number}
                </Typography>
                <TableContainer>
                  <Table className={classes.table} aria-label="simple table">
                    <TableBody>
                      <TableRow key="hash">
                        <TableCell width="25%" size="small">Hash</TableCell>
                        <TableCell align="left" padding="default" data-value={block.hash}>
                          {block.hash}
                        </TableCell>
                      </TableRow>
                      <TableRow key="gasUsed">
                        <TableCell width="25%" size="small">Gas Used</TableCell>
                        <TableCell align="left" padding="default" data-value={block.gasUsed}>
                          {block.gasUsed}
                        </TableCell>
                      </TableRow>
                      <TableRow key="gasLimit">
                        <TableCell width="25%" size="small">Gas Limit</TableCell>
                        <TableCell align="left" padding="default" data-value={block.gasLimit}>
                          {block.gasLimit}
                        </TableCell>
                      </TableRow>
                      <TableRow key="timestamp">
                        <TableCell width="25%" size="small">Timestamp</TableCell>
                        <TableCell align="left" padding="default" data-value={block.timestamp}>
                          {block.timestamp}
                        </TableCell>
                      </TableRow>
                      <TableRow key="parentHash">
                        <TableCell width="25%" size="small">Parent Hash</TableCell>
                        <TableCell align="left" padding="default" data-value={block.parentHash}>
                          {block.parentHash}
                        </TableCell>
                      </TableRow>
                      <TableRow key="txRoot">
                        <TableCell width="25%" size="small">Tx Root</TableCell>
                        <TableCell align="left" padding="default" data-value={block.txRoot}>
                          {block.txRoot}
                        </TableCell>
                      </TableRow>
                      <TableRow key="stateRoot">
                        <TableCell width="25%" size="small">State Root</TableCell>
                        <TableCell align="left" padding="default" data-value={block.stateRoot}>
                          {block.stateRoot}
                        </TableCell>
                      </TableRow>
                      <TableRow key="receiptRoot">
                        <TableCell width="25%" size="small">Receipt Root</TableCell>
                        <TableCell align="left" padding="default" data-value={block.receiptRoot}>
                          {block.receiptRoot}
                        </TableCell>
                      </TableRow>
                      <TableRow key="extraData">
                        <TableCell width="25%" size="small">Extra Data</TableCell>
                        <TableCell
                          align="left"
                          padding="default"
                          data-value={block.extraData}
                        >
                          {block.extraData}
                        </TableCell>
                      </TableRow>
                      <TableRow key="transactions">
                        <TableCell width="25%" size="small">Transactions</TableCell>
                        <TableCell align="left" padding="default" data-value={block.transactions}>
                          {block.transactions.map((tx) => (
                            <div>
                              <Link
                                to={`/transactions/${tx}`}
                              >
                                {tx}
                              </Link>
                            </div>
                          ))}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </div>
  )
}
