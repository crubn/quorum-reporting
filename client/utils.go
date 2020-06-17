package client

import (
	"context"
	"errors"
	"math/big"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/p2p"

	"quorumengineering/quorum-report/log"
)

func DumpAddress(c Client, address common.Address, blockNumber uint64) (*state.DumpAccount, error) {
	log.Debug("Fetching account dump", "account", address.String(), "blocknumber", blockNumber)
	dumpAccount := &state.DumpAccount{}
	err := c.RPCCall(context.Background(), &dumpAccount, "debug_dumpAddress", address, hexutil.EncodeUint64(blockNumber))
	if err != nil {
		return nil, err
	}
	return dumpAccount, nil
}

func TraceTransaction(c Client, txHash common.Hash) (map[string]interface{}, error) {
	log.Debug("Tracing transaction", "tx", txHash.String())

	// Trace internal calls of the transaction
	// Reference: https://github.com/ethereum/go-ethereum/issues/3128
	var resp map[string]interface{}
	type TraceConfig struct {
		Tracer string
	}
	err := c.RPCCall(context.Background(), &resp, "debug_traceTransaction", txHash, &TraceConfig{Tracer: "callTracer"})
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func GetCode(c Client, address common.Address, blockHash common.Hash) (hexutil.Bytes, error) {
	var res hexutil.Bytes
	if err := c.RPCCall(context.Background(), &res, "eth_getCode", address, blockHash.String()); err != nil {
		return nil, err
	}
	return res, nil
}

func Consensus(c Client) (string, error) {
	log.Debug("Fetching consensus info")

	var resp p2p.NodeInfo
	err := c.RPCCall(context.Background(), &resp, "admin_nodeInfo")
	if err != nil {
		return "", err
	}
	if resp.Protocols["istanbul"] != nil {
		return "istanbul", nil
	}
	protocol := resp.Protocols["eth"].(map[string]interface{})
	return protocol["consensus"].(string), nil
}

func CallEIP165(c Client, address common.Address, interfaceId []byte, blockNum *big.Int) (bool, error) {
	eip165Id := common.Hex2Bytes("01ffc9a70")

	//interfaceId should be 4 bytes long
	if len(interfaceId) != 4 {
		return false, errors.New("interfaceId wrong size")
	}

	calldata := append(eip165Id, common.RightPadBytes(interfaceId, 32)...)

	msg := ethereum.CallMsg{
		To:   &address,
		Data: calldata,
	}

	result, err := c.CallContract(context.Background(), msg, blockNum)
	if err != nil {
		return false, err
	}
	if len(result) != 32 {
		return false, nil
	}
	return result[len(result)-1] == 0x1, nil
}
