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
import Alert from '@material-ui/lab/Alert'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSingleBlock } from '../client/fetcher'
import ListMakerArray from '../components/listMakerArray'
import CustomTooltip from '../components/Tooltip'
import tooltipText from '../resources/tooltipText.json'

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
  console.log(block)
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
                          <TableCell width="25%" size="small"><CustomTooltip text={tooltipText.hash}>Hash</CustomTooltip></TableCell>
                          <TableCell align="left" padding="default" data-value={block.hash}>
                            {block.hash}
                          </TableCell>
                        </TableRow>
                        <TableRow key="gasUsed">
                          <TableCell width="25%" size="small"><CustomTooltip text={tooltipText.gasUsed}>Gas Used</CustomTooltip></TableCell>
                          <TableCell align="left" padding="default" data-value={block.gasUsed}>
                            {block.gasUsed}
                          </TableCell>
                        </TableRow>
                        <TableRow key="gasLimit">
                          <TableCell width="25%" size="small"><CustomTooltip text={tooltipText.gasLimit}>Gas Limit</CustomTooltip></TableCell>
                          <TableCell align="left" padding="default" data-value={block.gasLimit}>
                            {block.gasLimit}
                          </TableCell>
                        </TableRow>
                        <TableRow key="timestamp">
                          <TableCell width="25%" size="small"><CustomTooltip text={tooltipText.timestamp}>Timestamp</CustomTooltip></TableCell>
                          <TableCell align="left" padding="default" data-value={block.timestamp}>
                            {new Date(block.timestamp).toString()}
                          </TableCell>
                        </TableRow>
                        <TableRow key="parentHash">
                          <TableCell width="25%" size="small"><CustomTooltip text={tooltipText.parentHash}>Parent Hash</CustomTooltip></TableCell>
                          <TableCell align="left" padding="default" data-value={block.parentHash}>
                            {block.parentHash}
                          </TableCell>
                        </TableRow>
                        <TableRow key="txRoot">
                          <TableCell width="25%" size="small"><CustomTooltip text={tooltipText.txRoot}>Tx Root</CustomTooltip></TableCell>
                          <TableCell align="left" padding="default" data-value={block.txRoot}>
                            {block.txRoot}
                          </TableCell>
                        </TableRow>
                        <TableRow key="stateRoot">
                          <TableCell width="25%" size="small"><CustomTooltip text={tooltipText.stateRoot}>State Root</CustomTooltip></TableCell>
                          <TableCell align="left" padding="default" data-value={block.stateRoot}>
                            {block.stateRoot}
                          </TableCell>
                        </TableRow>
                        <TableRow key="receiptRoot">
                          <TableCell width="25%" size="small"><CustomTooltip text={tooltipText.receiptRoot}>Receipt Root</CustomTooltip></TableCell>
                          <TableCell align="left" padding="default" data-value={block.receiptRoot}>
                            {block.receiptRoot}
                          </TableCell>
                        </TableRow>
                        <TableRow key="extraData">
                          <TableCell width="25%" size="small"><CustomTooltip text={tooltipText.extraData}>Extra Data</CustomTooltip></TableCell>
                          <TableCell
                            align="left"
                            padding="default"
                            data-value={block.extraData}
                          >
                            {block.extraData}
                          </TableCell>
                        </TableRow>
                        <TableRow key="transactions">
                          <TableCell width="25%" size="small"><CustomTooltip text={tooltipText.transactions}>Transactions</CustomTooltip></TableCell>
                          <TableCell align="left" padding="default" data-value={block.transactions}>

                            <ListMakerArray
                              type="none"
                              title=""
                              accordionTitle="Transactions"
                              list={

                                block.transactions.map((tx) => (
                                  <Link
                                    to={`/transactions/${tx}`}
                                  >
                                    {tx}
                                  </Link>
                                ))
                              }
                            />

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
