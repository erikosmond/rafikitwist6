/* global document */

import humps from 'humps'
import request from 'superagent'

export async function callApi(url, params = {}) {
  const method = params.method || 'GET'
  const sentData = params.data || {}
  const { rawServerResponse } = params
  let response
  const token = document.getElementsByName('csrf-token')[0].content
  try {
    if (params.file) {
      response = await request(method, url)
        .set('X-CSRF-Token', token)
        .accept('application/json')
        .attach('files[]', params.file)
        .field(humps.decamelizeKeys(sentData))
    } else if (method === 'GET') {
      response = await request(method, url)
        .set('X-CSRF-Token', token)
        .accept('application/json')
        .query(humps.decamelizeKeys(sentData))
    } else {
      response = await request(method, url)
        .set('X-CSRF-Token', token)
        .accept('application/json')
        .send(humps.decamelizeKeys(sentData))
    }

    return {
      success: true,
      data: rawServerResponse ? response.body : humps.camelizeKeys(response.body),
      code: response.statusCode,
    }
  } catch (e) {
    const data = (e.response === undefined) ? null : humps.camelizeKeys(e.response.body)
    const code = (e.response === undefined) ? null : e.response.statusCode

    return {
      success: false,
      data,
      code,
    }
  }
}

export default callApi
