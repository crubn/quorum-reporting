import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import React from 'react'
import { Link } from 'react-router-dom'
import ListMakerArray from '../listMakerArray'
import { ListMaker } from '../listMakerJSON'
import PaginatedTableView from './PaginatedTableView'

const useRowStyles = makeStyles({
  root: { '& > *': { borderBottom: 'unset' } },
  link: {
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#1976D2',
  },
})

export function TransactionTable({ searchReport, address }) {
  return (
    <PaginatedTableView
      title={searchReport.label}
      HeaderView={TransactionHeader}
      ItemView={TransactionRowItem}
      getItems={(page, rowsPerPage, lastItem) => {
        return searchReport.getItems({ address, ...searchReport.params }, {
          pageNumber: page,
          pageSize: rowsPerPage,
          after: lastItem,
        })
      }}
    />
  )
}

export function TransactionHeader() {
  return (
    <TableHead>
      <TableRow>
        <TableCell width="5%" />
        <TableCell width="5%"><strong>Block</strong></TableCell>
        <TableCell width="30%"><strong>Transaction Hash</strong></TableCell>
        <TableCell width="40%"><strong>From</strong></TableCell>
        <TableCell width="20%"><strong>Organization ID</strong></TableCell>
      </TableRow>
    </TableHead>
  )
}

export function TransactionRowItem(tx, i) {
  console.log(tx)
  return (
    <ExpandableTxRow
      key={`${tx.hash} ${i}`}
      txHash={tx.hash}
      from={tx.from}
      to={tx.to}
      blockNumber={tx.blockNumber}
      parsedTransaction={tx.parsedTransaction}
      parsedEvents={tx.parsedEvents}
      internalCalls={tx.internalCalls}
    />
  )
}

export function SignatureSplitter({ type, text }) {
  console.log(text)
  try {
    if (text) {
  const textSplit = text.split('(')
  const transactionName = textSplit[0]
  const transactionSignData = textSplit[1].slice(0, textSplit[1].length - 1).split(',').map((x) => {
    const ar = x.split(' _')
    return `${ar[1]} : ${ar[0]}`
})
  return (
      <ListMakerArray type={type} title={transactionName} list={transactionSignData} accordionTitle="Signature Data" />
  )
    }
      return (<></>)
  } catch (e) {
    console.log(e)
    return (<>{text}</>)
  }
}

export function ExpandableTxRow({ blockNumber, from, internalCalls, parsedEvents, parsedTransaction, txHash }) {
  const [open, setOpen] = React.useState(false)
  const classes = useRowStyles()

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell component="th">
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">
          <Link
            className={classes.link}
            to={`/blocks/${blockNumber}`}
          >
            {blockNumber}
          </Link>
        </TableCell>
        <TableCell>
          <Link className={classes.link} to={`/transactions/${txHash}`}>{txHash}</Link>
        </TableCell>
        <TableCell>
          {from}
        </TableCell>
        <TableCell>{parsedTransaction && parsedTransaction.parsedData ? parsedTransaction.parsedData._orgId : ''}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
          }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography>Parsed Transaction</Typography>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell width="30%"><strong>Transaction Signature</strong></TableCell>
                    <TableCell width="20%"><strong>Function 4 Bytes</strong></TableCell>
                    <TableCell width="50%"><strong>Parsed Data</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell width="30%"><SignatureSplitter type="Transaction" text={parsedTransaction.txSig} /></TableCell>
                    <TableCell width="20%">{parsedTransaction.func4Bytes}</TableCell>
                    <TableCell width="50%" style={{ textAlign: 'left', overflowX: 'auto' }}>
                      <ListMaker
                        title="Parsed Data"
                        data={parsedTransaction.parsedData}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <br />
              {
                (parsedEvents && parsedEvents.length > 0)
                && (
                  <div>
                    <Typography>Parsed Events</Typography>
                    <Table size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Event Signature</strong></TableCell>
                          <TableCell><strong>Parsed Data</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          parsedEvents.map((event, i) => (
                            <TableRow key={`${event.eventSig + JSON.stringify(event.parsedData)}${i}`}>
                              <TableCell><SignatureSplitter type="Transaction" text={event.eventSig} /></TableCell>
                              <TableCell>
                                <ListMaker
                                  title="Parsed Data"
                                  data={event.parsedData}
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        }
                      </TableBody>
                    </Table>
                  </div>
                )
              }
              <br />
              {
                (internalCalls && internalCalls.length > 0)
                && (
                  <div>
                    <Typography>Internal Calls</Typography>
                    <Table size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>From</strong></TableCell>
                          <TableCell><strong>To</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          internalCalls.map((c, i) => (
                            <TableRow key={`${c.from + c.to}${i}`}>
                              <TableCell>{c.from}</TableCell>
                              <TableCell>{c.to}</TableCell>
                            </TableRow>
                          ))
                        }
                      </TableBody>
                    </Table>
                  </div>
                )
              }
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}
