import {
    getLastPersistedBlockNumber,
    getAddresses,
    getABI,
    getStorageABI,
    getContractCreationTransaction,
    getAllTransactionsToAddress,
    getAllTransactionsInternalToAddress,
    getAllEventsFromAddress,
    getStorageHistory,
    addAddress,
    deleteAddress,
    getBlock,
    getTransaction,
    addTemplate,
    assignTemplate,
    getERC20TokenHolders,
    getERC721TokensAtBlock, getHolderForERC721TokenAtBlock,
} from '../client/rpcClient'
import {
    getContractTemplate,
    getERC20TokenBalance,
    getERC721TokenHolders,
    getERC721TokensForAccountAtBlock
} from './rpcClient'

export const getBlockNumber = (baseURL) => {
    return getLastPersistedBlockNumber(baseURL).then( (res) => {
        if (res.data.error) {
            throw res.data.error.message
        }
        return res.data.result
    })
};

export const addContract = (baseURL, newContract) => {
    return addAddress(baseURL, newContract.address).then( (res) => {
        if (res.data.error) {
            throw res.data.error.message
        }
        if(newContract.template === 'new') {
            return addTemplate(baseURL, newContract.newTemplate)
              .then((template) => assignTemplate(baseURL, newContract.address, newContract.newTemplate.name))
        }
        return assignTemplate(baseURL, newContract.address, newContract.template)
    })
};

export const deleteContract = (baseURL, address) => {
    return deleteAddress(baseURL, address).then( (res) => {
        if (res.data.error) {
            throw res.data.error.message
        }
        return res
    })
};

export const getContracts = (baseURL) => {
    return getAddresses(baseURL).then( (res) => {
        if (res.data.error) {
            throw res.data.error.message
        }
        return getContractsDetail(baseURL, res.data.result)
          .then((contracts) => {
                // sort by template name + address for consistent order
                return contracts.sort((a, b) =>
                  `${a.name}${a.address}`.localeCompare(`${b.name}${b.address}`))
            }
          )
    })
};

export const getContractCreationTx = (baseURL, address) => {
    return getContractCreationTransaction(baseURL, address).then( (res) => {
        if (res.data.error) {
            throw res.data.error.message
        }
        return res.data.result
    })
};

export const getToTxs = (baseURL, address, options) => {
    return getAllTransactionsToAddress(baseURL, address, options).then( (res) => {
        if (res.data.error) {
            throw res.data.error.message
        }
        return getTransactionsDetail(baseURL, res.data.result["transactions"]).then( (txs) => {
            return {
                data: txs,
                total: res.data.result["total"]
            }
        })
    })
};

export const getInternalToTxs = (baseURL, address) => {
    return getAllTransactionsInternalToAddress(baseURL, address).then( (res) => {
        if (res.data.error) {
            throw res.data.error.message
        }
        return getTransactionsDetail(baseURL, res.data.result["transactions"]).then( (txs) => {
            return {
                data: txs,
                total: res.data.result["total"]
            }
        })
    })
};

export const getEvents = (baseURL, address, options) => {
    return getAllEventsFromAddress(baseURL, address, options).then( (res) => {
        if (res.data.error) {
            throw res.data.error.message
        }
        return {
            data: res.data.result["events"].map( (event) => ({
                topic: event.rawEvent.topics[0],
                txHash: event.rawEvent.transactionHash,
                address: event.rawEvent.address,
                blockNumber: event.rawEvent.blockNumber,
                parsedEvent: {
                    eventSig: event.eventSig,
                    parsedData: event.parsedData,
                },
            })),
            total: res.data.result["total"]
        }
    })
};

export const getReportData = (baseURL, address, startBlockNumber, endBlockNumber, options) => {
    return getStorageHistory(baseURL, address, startBlockNumber, endBlockNumber, options).then( (res) => {
        if (res.data.error) {
            throw res.data.error.message
        }
        return {
            data: generateReportData(res.data.result.historicState),
            total: res.data.result["total"]
    }
    })
};

function calculateTotal (result, options) {
    let lastPage = result.length < options.pageSize
    let currentTotal = options.pageSize * options.pageNumber + result.length
    // -1 means total unknown, set current total to disable next on last page
    let total = lastPage ? currentTotal : -1
    return total
}

export const getERC20Holders = (baseURL, address, block, options) => {
    return getERC20TokenHolders(baseURL, address, block, options).then( (res) => {
        if (res.data.error) {
            throw res.data.error.message
        }
        let total = calculateTotal(res.data.result, options)
        return {
            data: res.data.result,
            total
        }
    })
};

export const getERC20Balance = (baseURL, address, holder, startBlockNumber, endBlockNumber, options) => {
    return getERC20TokenBalance(baseURL, address, holder, startBlockNumber, endBlockNumber, options).then( (res) => {
        if (res.data.error) {
            throw res.data.error.message
        }
        let data = Object.entries(res.data.result).map(([key, value]) => ({ block: key, balance: value })).sort((one, two) => two.block - one.block)
        let total = calculateTotal(res.data.result, options)
        return {
            data: data,
            total,
        }
    })
};

export const getERC721Holders = (baseURL, address, block, options) => {
    return getERC721TokenHolders(baseURL, address, block, options).then( (res) => {
        if (res.data.error) {
            throw res.data.error.message
        }
        let total = calculateTotal(res.data.result, options)
        return {
            data: res.data.result,
            total
        }
    })
};

export const getERC721Tokens = (baseURL, address, block, options) => {
    return getERC721TokensAtBlock(baseURL, address, block, options).then( (res) => {
        if (res.data.error) {
            throw res.data.error.message
        }
        let total = calculateTotal(res.data.result, options)
        return {
            data: res.data.result,
            total
        }
    })
};

export const getERC721TokensForAccount = (baseURL, address, holder, block, options) => {
    return getERC721TokensForAccountAtBlock(baseURL, address, holder, block, options).then( (res) => {
        if (res.data.error) {
            throw res.data.error.message
        }
        let total = calculateTotal(res.data.result, options)
        return {
            data: res.data.result,
            total
        }
    })
};

export const getHolderForERC721Token = (baseURL, address, tokenId, block) => {
    return getHolderForERC721TokenAtBlock(baseURL, address, tokenId, block).then( (res) => {
        if (res.data.error) {
            throw res.data.error.message
        }
        return {
            data: [res.data.result.replace('0x0x', '0x')], // TODO remove this when fixed
            total: 1,
        }
    })
};


export const getSingleBlock = (baseURL, blockNumber) => {
    return getBlock(baseURL, blockNumber).then( (res) => {
        if (res.data.error) {
            throw res.data.error.message
        }
        return res.data.result
    })
};

export const getSingleTransaction = (baseURL, txHash) => {
    return getTransaction(baseURL, txHash).then( (res) => {
        if (res.data.error) {
            throw res.data.error.message
        }
        return {
            txSig: res.data.result.txSig,
            func4Bytes: res.data.result.func4Bytes,
            parsedData: res.data.result.parsedData,
            parsedEvents: res.data.result.parsedEvents,
            ...res.data.result.rawTransaction
        }
    })
};

const getContractsDetail = (baseURL, addresses) => {
  return Promise.all(
    addresses.map((address) => {
        return Promise.all([
          getABI(baseURL, address).then((res) => res.data.result),
          getStorageABI(baseURL, address).then((res) => res.data.result),
          getContractTemplate(baseURL, address).then((res) => res.data.result),
          ]
        ).then(([abi, storageLayout, name]) => {
            return { address, abi, storageLayout, name }
        })
    })
  )
};

const getTransactionsDetail = (baseURL, txs) => {
    return new Promise( (resolve, reject) => {
        if (txs.length === 0) {
            resolve([])
        }
        let txsWithDetails = [];
        let counter = txs.length;
        for (let i = 0; i < txs.length; i++) {
            txsWithDetails.push({hash: txs[i]});
            ( (x) => {
                getTransactionDetail(baseURL, txs[x]).then( (res) => {
                    txsWithDetails[x] = res;
                    counter--;
                    if (counter === 0) {
                        resolve(txsWithDetails)
                    }
                }).catch(reject)
            })(i)
        }
    })
};

const getTransactionDetail = (baseURL, txHash) => {
    return getTransaction(baseURL, txHash).then( (res) => {
        return {
            hash: res.data.result.rawTransaction.hash,
            from: res.data.result.rawTransaction.from,
            to: res.data.result.rawTransaction.to,
            blockNumber: res.data.result.rawTransaction.blockNumber,
            parsedTransaction: {
                txSig: res.data.result.txSig,
                func4Bytes: res.data.result.func4Bytes,
                parsedData: res.data.result.parsedData,
            },
            parsedEvents: res.data.result.parsedEvents,
            internalCalls: res.data.result.rawTransaction.internalCalls,
        }
    })
};

const generateReportData = (historicState) => {
    if (historicState.length === 0) {
        return []
    }
    let reportData = [historicState[0]];
    let currentState = historicState[0];
    for (let i = 1; i < historicState.length; i++) {
        let nextState = isStateEqual(currentState, historicState[i]);
        if (nextState) {
            reportData.unshift(nextState);
            currentState = nextState
        }
    }
    return reportData
};

const isStateEqual = (state1, state2) => {
    let markedState2 = state2;
    let noChange = true;
    for (let i = 0; i < state1.historicStorage.length; i++) {
        if (state1.historicStorage[i].value !== state2.historicStorage[i].value) {
            markedState2.historicStorage[i].changed = true;
            noChange = false
        }
    }
    if (noChange) {
        return false
    }
    return markedState2
};