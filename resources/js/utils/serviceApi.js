// Service API utilities

const API_BASE_URL = '/api';

/**
 * Fetch all categories with their services
 */
export async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/**
 * Fetch all services
 */
export async function fetchServices(categoryId = null) {
  try {
    let url = `${API_BASE_URL}/services`;
    if (categoryId) {
      url = `${API_BASE_URL}/services/category/${categoryId}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}

/**
 * Get categories formatted for the form
 */
export function getCategoriesFromApi(categories = []) {
  if (!Array.isArray(categories)) return [];
  
  return categories.map(cat => ({
    id: cat.id,
    label: cat.name,
    description: cat.description
  }));
}

/**
 * Get procedures with pricing details from API data
 */
export function getProceduresWithVariationsFromApi(services = []) {
  if (!Array.isArray(services)) return [];

  return services.map(service => ({
    id: service.id,
    name: service.name,
    category: service.category?.name || '',
    description: service.description,
    pricing: {
      types: Array.isArray(service.pricingTypes) ? service.pricingTypes.map(type => ({
        name: type.name,
        price_from: type.pivot?.price_from || 0,
        price_to: type.pivot?.price_to || 0
      })) : [],
      materials: Array.isArray(service.materials) ? service.materials.map(material => ({
        name: material.name,
        price: material.price || 0
      })) : []
    },
    total_price: service.total_price || { min: 0, max: 0 }
  }));
}

/**
 * Get all procedures with variations
 */
export function getAllProceduresWithVariationsFromApi(services = []) {
  if (!Array.isArray(services)) return [];
  return getProceduresWithVariationsFromApi(services);
}

/**
 * Get procedures for a specific category
 */
export function getProceduresForCategory(services = [], categoryId) {
  if (!Array.isArray(services) || !categoryId) return [];
  return services.filter(service => service.category?.id === categoryId);
}

/**
 * Main function to fetch all data
 */
export async function fetchServiceData() {
  try {
    const [categories, services] = await Promise.all([
      fetchCategories(),
      fetchServices()
    ]);

    return {
      categories: categories || [],
      services: services || [],
      getCategories: () => categories?.map(cat => cat.name) || [],
      getAllProceduresWithVariations: () => getProceduresWithVariationsFromApi(services)
    };
  } catch (error) {
    console.error('Error fetching service data:', error);
    throw error;
  }
}