export interface Store {
  id: number
  slug: string
  name: string
  description: string
  domain: string
  active: boolean
}

export interface Category {
  id: number
  name: string
  slug: string
  storeId: number
  storeName?: string
  active: boolean
}

export interface CategoryRequest {
  name: string
  slug: string
  storeId: number
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  price: number
  stock: number
  active: boolean
  storeSlug: string
  categoryName: string | null
  categorySlug: string | null
  imageUrls: string[]
  primaryImageUrl: string | null
}

export interface ProductRequest {
  name: string
  slug: string
  description?: string
  price: number
  stock: number
  storeId: number
  categoryId?: number | null
  imageUrls: string[]
}

export interface AuthResponse {
  token: string
  username: string
  role: string
}

export interface LoginRequest {
  username: string
  password: string
}
