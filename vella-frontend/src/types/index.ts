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

export interface Customer {
  id: number
  email: string
  fullName: string
  phone: string | null
  storeSlug: string
}

export interface CustomerRegisterRequest {
  storeSlug: string
  email: string
  password: string
  fullName: string
  phone?: string
}

export interface CustomerLoginRequest {
  storeSlug: string
  email: string
  password: string
}

export interface CustomerAuthResponse {
  token: string
  customer: Customer
}

export interface VerifyEmailRequest {
  storeSlug: string
  email: string
  code: string
}

export interface ResendCodeRequest {
  storeSlug: string
  email: string
}
