import { fetchUtils } from 'react-admin'
import { apiUrl } from './apiConfig'
import { getAuthToken } from './authSession'

const responseKeys = {
  users: 'user',
  products: 'product',
  categories: 'category',
  carts: 'cart',
  'cart-items': 'cart_item',
  orders: 'order',
  'order-items': 'order_item',
}

const endpoint = (resource, id) =>
  `${apiUrl}/${resource}${id === undefined ? '' : `/${encodeURIComponent(id)}`}`

const request = async (url, options = {}) => {
  const headers = new Headers(options.headers)
  const token = getAuthToken()

  headers.set('Accept', 'application/json')
  if (options.body) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  try {
    const { json } = await fetchUtils.fetchJson(url, { ...options, headers })
    return json
  } catch (error) {
    const message = error.body?.error || error.body?.message || error.message
    error.message = message
    throw error
  }
}

const unwrap = (resource, payload) =>
  payload?.[responseKeys[resource]] || payload

const cleanRecord = (record) =>
  Object.fromEntries(
    Object.entries(record).filter(
      ([key, value]) =>
        key !== 'id' &&
        key !== 'created_at' &&
        key !== 'updated_at' &&
        key !== 'items' &&
        value !== '',
    ),
  )

const applyFilters = (records, filter = {}) =>
  records.filter((record) =>
    Object.entries(filter).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true
      if (key === 'q') {
        return Object.values(record).some((field) =>
          String(field ?? '').toLowerCase().includes(String(value).toLowerCase()),
        )
      }
      return String(record[key] ?? '').toLowerCase().includes(String(value).toLowerCase())
    }),
  )

const applySort = (records, sort) => {
  if (!sort?.field) return records
  return [...records].sort((left, right) => {
    const a = left[sort.field]
    const b = right[sort.field]
    const result = typeof a === 'number' && typeof b === 'number'
      ? a - b
      : String(a ?? '').localeCompare(String(b ?? ''), undefined, { numeric: true })
    return sort.order === 'DESC' ? -result : result
  })
}

const pagedList = (records, params) => {
  const filtered = applyFilters(records, params.filter)
  const sorted = applySort(filtered, params.sort)
  const page = params.pagination?.page || 1
  const perPage = params.pagination?.perPage || 25
  const start = (page - 1) * perPage
  return { data: sorted.slice(start, start + perPage), total: sorted.length }
}

export const dataProvider = {
  getList: async (resource, params) => {
    if (resource === 'order-items') {
      const orderId = params.filter?.order_id
      if (!orderId) return { data: [], total: 0 }
      const data = await request(`${apiUrl}/order-items/order/${encodeURIComponent(orderId)}`)
      return pagedList(data, params)
    }
    const data = await request(endpoint(resource))
    return pagedList(data, params)
  },

  getOne: async (resource, params) => {
    const data = await request(endpoint(resource, params.id))
    return { data: unwrap(resource, data) }
  },

  getMany: async (resource, params) => {
    const data = await request(endpoint(resource))
    return { data: data.filter((record) => params.ids.map(String).includes(String(record.id))) }
  },

  getManyReference: async (resource, params) => {
    const filter = { ...params.filter, [params.target]: params.id }
    return dataProvider.getList(resource, { ...params, filter })
  },

  create: async (resource, params) => {
    const payload = await request(endpoint(resource), {
      method: 'POST',
      body: JSON.stringify(cleanRecord(params.data)),
    })
    return { data: unwrap(resource, payload) }
  },

  update: async (resource, params) => {
    const payload = await request(endpoint(resource, params.id), {
      method: 'PUT',
      body: JSON.stringify(cleanRecord(params.data)),
    })
    return { data: unwrap(resource, payload) }
  },

  delete: async (resource, params) => {
    const payload = await request(endpoint(resource, params.id), { method: 'DELETE' })
    return { data: { ...params.previousData, id: payload.id ?? params.id } }
  },

  deleteMany: async (resource, params) => {
    await Promise.all(params.ids.map((id) => request(endpoint(resource, id), { method: 'DELETE' })))
    return { data: params.ids }
  },

  updateMany: () => Promise.reject(new Error('Bulk updates are not supported by this API.')),
}

export { apiUrl }
