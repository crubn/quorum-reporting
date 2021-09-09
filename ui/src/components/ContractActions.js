import React, { useState } from 'react'
import CardContent from '@material-ui/core/CardContent'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Alert from '@material-ui/lab/Alert'
import { useSelector } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import Reports, { getReportsForTemplate } from '../reports'
import ContractSelector from './ContractSelector'

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  formControl: { margin: theme.spacing(1) },
}))

export default function ContractActions({ onSearch, contractDetail }) {
  const reports = getReportsForTemplate(contractDetail.name)
  const classes = useStyles()
  const lastPersistedBlockNumber = useSelector((state) => state.system.lastPersistedBlockNumber)
  const [error, setError] = useState('')
  const [account, setAccount] = useState('')
  const [atBlock, setAtBlock] = useState('')
  const [tokenId, setTokenId] = useState('')
  const [startNumber, setStartNumber] = useState('')
  const [endNumber, setEndNumber] = useState('')
  const [selectedReport, setSelectedReport] = useState(reports[0])
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5">Reports</Typography>
        <div align="center">
          {
            error
            && (
              <div>
                <br />
                <Alert severity="error">{error}</Alert>
              </div>
            )
          }
          <br />
          <ContractSelector
            reports={reports}
            selectedReport={selectedReport.value}
            handleSelectedReportChange={(e) => {
              setSelectedReport(Reports[e.target.value])
            }}
          />
          {selectedReport.fields.account
          && (
            <FormControl className={classes.formControl}>
              <TextField
                label="For Account"
                placeholder="0xb6ae71..."
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                variant="filled"
                size="small"
              />
            </FormControl>
          )}
          {selectedReport.fields.tokenId
          && (
            <FormControl className={classes.formControl}>
              <TextField
                label="Token ID"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                variant="filled"
                size="small"
              />
            </FormControl>
          )}
          {selectedReport.fields.block
          && (
            <FormControl className={classes.formControl}>
              <TextField
                label="At Block Number"
                value={atBlock}
                placeholder={lastPersistedBlockNumber ? lastPersistedBlockNumber.toString() : ''}
                onChange={(e) => setAtBlock(e.target.value)}
                variant="filled"
                size="small"
              />
            </FormControl>
          )}
          {selectedReport.fields.startBlock
          && (
            <FormControl className={classes.formControl}>
              <TextField
                label="Start Block Number"
                value={startNumber}
                placeholder="1"
                onChange={(e) => setStartNumber(e.target.value)}
                variant="filled"
                size="small"
              />
            </FormControl>
          )}
          {selectedReport.fields.endBlock
          && (
            <FormControl className={classes.formControl}>
              <TextField
                label="End Block Number"
                value={endNumber}
                placeholder={lastPersistedBlockNumber ? lastPersistedBlockNumber.toString() : ''}
                onChange={(e) => setEndNumber(e.target.value)}
                variant="filled"
                size="small"
              />
            </FormControl>
          )}
          <br />
          <br />
          <Button
            align="right"
            variant="contained"
            color="primary"
            onClick={() => {
              if (selectedReport.fields.startBlock === 'required'
                && (startNumber !== '' || Number.isNaN(startNumber))) {
                setError('Invalid start block number')
                return
              }
              if (selectedReport.fields.endBlock === 'required'
                && (endNumber !== '' || Number.isNaN(endNumber))) {
                setError('Invalid end block number')
                return
              }
              if (selectedReport.fields.block === 'required'
                && (atBlock !== '' || Number.isNaN(atBlock))) {
                setError('Invalid block number')
                return
              }
              if (selectedReport.fields.account === 'required'
                && (account === '')) {
                setError('Account cannot be empty')
                return
              }
              if (selectedReport.fields.tokenId === 'required'
                && (tokenId === '')) {
                setError('Token ID cannot be empty')
                return
              }
              onSearch({
                ...selectedReport,
                params: {
                  startNumber: startNumber || 1,
                  endNumber: endNumber || lastPersistedBlockNumber,
                  atBlock: endNumber || lastPersistedBlockNumber,
                  account,
                  tokenId,
                },
              })
              setStartNumber('')
              setEndNumber('')
              setAccount('')
              setAtBlock('')
              setTokenId('')
            }}
          >
            <SearchIcon />
            &nbsp;
            Search
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
