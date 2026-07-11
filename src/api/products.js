const BASE_URL = 'https://dummyjson.com'

async function request(url) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${res.statusText}`)
  }
  return res.json()
}


export async function fetchProductsForClientFilter({ category = '' } = {}) {
  const url = category
    ? `${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=100`
    : `${BASE_URL}/products?limit=100`
  return request(url)
}

export async function fetchCategories() {
  return request(`${BASE_URL}/products/categories`)
}


