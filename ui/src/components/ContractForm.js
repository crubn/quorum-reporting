import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import HelpIcon from '@material-ui/icons/Help'
import Alert from '@material-ui/lab/Alert'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { addContract } from '../client/fetcher'
import { addTemplate, assignTemplate, getTemplates } from '../client/rpcClient'

const useStyles = makeStyles((theme) => ({
  tooltipControl: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  helpIcon: {
    marginLeft: 6,
    marginBottom: 6,
    color: theme.palette.primary.contrastText
  },
}))

function ContractForm({ handleCloseSetting, handleRegisterNewContract, isOpen, existingContract }) {
  const classes = useStyles()
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [address, setAddress] = useState(existingContract ? existingContract.address : '')
  const [abi, setAbi] = useState('')
  const [name, setName] = useState('')
  const [storageLayout, setStorageLayout] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const rpcEndpoint = useSelector((state) => state.system.rpcEndpoint)

  useEffect(() => {
    if (!rpcEndpoint) {
      return
    }
    getTemplates()
      .then((res) => {
        setTemplates(res)
      })
  }, [rpcEndpoint])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegisterNewContract()
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleCloseSetting}
      aria-labelledby="form-dialog-title"
      maximumwidth="400"
      fullWidth
    >
      <DialogTitle id="form-dialog-title">
        Register a new contract for reporting.
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Contract Address"
          value={existingContract ? existingContract.address : address}
          disabled={existingContract !== undefined}
          onChange={(e) => setAddress(e.target.value)}
          onKeyPress={handleKeyPress}
          margin="dense"
          fullWidth
          autoFocus
        />
        <div className={classes.tooltipControl}>
          <FormControl margin="dense" fullWidth>
            <InputLabel>Contract Template</InputLabel>
            <Select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              {templates.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
              <MenuItem key="new" value="new"><strong>New Template</strong></MenuItem>
            </Select>
          </FormControl>
          <Tooltip
            title="Contract Templates are reusable definitions of the structure of a contract, including contract ABI and storage layouts."
          >
            <HelpIcon fontSize="small" color="action" />
          </Tooltip>
        </div>
        {selectedTemplate === 'new' && (
          <div>
            <Tooltip
              title="Give your template a name so to identify what type of contract is at an address (i.e. SimpleStorage, ERC20, ERC721)"
            >
              <TextField
                label="Contract Template Name"
                key="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                margin="dense"
                fullWidth
              />
            </Tooltip>
            <Tooltip
              title="Copy and paste the ABI output from the results of compiling your contract."
            >
              <TextField
                label="Contract Template ABI"
                key="abi"
                value={abi}
                onChange={(e) => setAbi(e.target.value)}
                onKeyPress={handleKeyPress}
                margin="dense"
                fullWidth
                multiline
              />
            </Tooltip>
            <Tooltip
              title="You can get the storageLayout from the results of compiling your contract if you run 'solc <contract> --combined-json storage-layout --pretty-json' on solc version 6.5+"
            >
              <TextField
                label="Contract Template Storage Template"
                key="storageLayout"
                value={storageLayout}
                onChange={(e) => setStorageLayout(e.target.value)}
                onKeyPress={handleKeyPress}
                margin="dense"
                fullWidth
                multiline
              />
            </Tooltip>
          </div>
        )}
      </DialogContent>
      {
        errorMessage
        && (
          <div>
            <br />
            <Alert severity="error">{errorMessage}</Alert>
          </div>
        )
      }
      <DialogActions>
        <Button onClick={handleCloseSetting} color="primary">
          Cancel
        </Button>
        <Button
          onClick={async () => {
            const contractAddress = existingContract ? existingContract.address : address
            if (contractAddress === '') {
              setErrorMessage('Address must not be empty')
              return
            }
            if (selectedTemplate === 'new') {
              if (name === '') {
                setErrorMessage('Template name must not be empty')
                return
              }
              if (abi === '') {
                setErrorMessage('Template abi must not be empty')
                return
              }
              if (storageLayout === '') {
                setErrorMessage('Storage Template must not be empty')
                return
              }
            } else if (selectedTemplate === '') {
              setErrorMessage('Please select a template')
              return
            }

            try {
              if (!existingContract) {
                await addContract(contractAddress)
              }
              if (selectedTemplate === 'new') {
                await addTemplate(name, abi, storageLayout)
                await assignTemplate(contractAddress, name)
              } else {
                await assignTemplate(contractAddress, selectedTemplate)
              }
              handleCloseSetting()
            } catch (e) {
              console.error(e)
              setErrorMessage(e.message)
            }
          }}
          color="primary"
        >
          Register
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ContractForm
