import test from 'ava'
import { connect, LedgerEnv } from '..'
/*newly added code for xmrd*/
/*import { addBtc, addEth, addXrp } from './helpers'*/
/*end*/
/*newly added code for xmrd*/
import { addBtc, addEth, addXrp, addXmrd } from './helpers'
/*end*/

require('envkey')

test('rebuilds sdk from a serialized config', async t => {
  const sdk = await connect(process.env.LEDGER_ENV as LedgerEnv)
  await Promise.all(
/*newly added code for xmrd*/
/*[addBtc, addXrp, addEth].map(createUplink => createUplink()(sdk))*/
/*end*/
/*newly added code for xmrd*/
    [addBtc, addXrp, addXmrd, addEth].map(createUplink => createUplink()(sdk))
/*end*/

  )
  await sdk.disconnect()

  const initialSerializedConfig = sdk.serializeConfig()

  // Reconnect the API
  const newSdk = await connect(
    process.env.LEDGER_ENV as LedgerEnv,
    initialSerializedConfig
  )
  t.is(newSdk.state.credentials.length, 3, 'same number of credentials')
  t.is(newSdk.state.uplinks.length, 3, 'same number of uplink')
  await newSdk.disconnect()

  const rebuiltSerializedConfig = newSdk.serializeConfig()

  t.is(
    JSON.stringify(rebuiltSerializedConfig),
    JSON.stringify(initialSerializedConfig),
    'config is persisted and can be rebuilt from the persisted version'
  )
})
