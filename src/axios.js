import { create as axios } from 'axios'
import { path } from 'rambda'

const accessToken = path('data.oauthToken.access_token')
const tokenType = path('data.oauthToken.token_type')
const accountId = path('data.accountId')

export function create(apiKey, isDemo) {
  return axios({
    baseURL: `https://${isDemo ? 'demo-' : ''}api.ig.com/gateway/deal/`,
    headers: {
      'Accept': 'application/json; charset=UTF-8',
      'Content-Type': 'application/json; charset=UTF-8',
      'X-IG-API-KEY': apiKey
    }
  })
}

export function setHeaderTokens(instance, response) {
  instance.defaults.headers['Authorization'] = `${tokenType(response)} ${accessToken(response)}`
  instance.defaults.headers['IG-ACCOUNT-ID'] = accountId(response)
}

export default create
