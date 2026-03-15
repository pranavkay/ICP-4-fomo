/**
 * Shopify Storefront API Client
 * 
 * This module handles all communication with the Shopify backend.
 * It uses the unauthenticated Storefront API to fetch products and manage cart/checkout.
 */

// Configuration
const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'fomobakery.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = '2024-01'; // Use a recent stable version

// Base URL for GraphQL requests
const API_URL = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

/**
 * Helper to send GraphQL requests
 */
async function shopifyFetch({ query, variables = {} }) {
  if (!STOREFRONT_ACCESS_TOKEN) {
    console.error('Error: VITE_SHOPIFY_STOREFRONT_TOKEN is missing. Please add it to your .env file.');
    return null;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();

    if (json.errors) {
      console.error('Shopify API Errors:', JSON.stringify(json.errors, null, 2));
      throw new Error('Failed to fetch from Shopify API');
    }

    return json.data;
  } catch (error) {
    console.error('Network error fetching from Shopify:', error);
    throw error;
  }
}

/**
 * Fetch all products (limited to first 20 for now)
 * This is used to populate the "Meet the Cookies" grid.
 */
export async function fetchProducts() {
  const query = `
    query getProducts {
      products(first: 20, sortKey: TITLE) {
        edges {
          node {
            id
            title
            handle
            description
            descriptionHtml
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
            tags
            variants(first: 10) {
                edges {
                    node {
                        id
                        title
                        price {
                            amount
                            currencyCode
                        }
                        compareAtPrice {
                            amount
                            currencyCode
                        }
                        selectedOptions {
                            name
                            value
                        }
                        image {
                            url
                            altText
                        }
                    }
                }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch({ query });
  return data ? data.products.edges.map(edge => normalizeProduct(edge.node)) : [];
}

/**
 * Normalize the complex GraphQL response into a simple object for our UI
 */
function normalizeProduct(node) {
  // Map images for gallery
  const gallery = node.images.edges.map(edge => ({
    url: edge.node.url,
    alt: edge.node.altText || node.title
  }));

  // Map variants
  const variants = node.variants.edges.map(edge => {
    const v = edge.node;
    return {
      id: v.id,
      title: v.title,
      price: formatPrice(v.price),
      priceRaw: v.price.amount,
      compareAtPrice: v.compareAtPrice ? formatPrice(v.compareAtPrice) : null,
      options: v.selectedOptions, // e.g. [{name: "Size", value: "Pack of 4"}]
      image: v.image?.url || null
    };
  });

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    price: formatPrice(node.priceRange.minVariantPrice), // Default 'from' price
    compareAtPrice: variants[0]?.compareAtPrice || null,

    image: gallery[0]?.url || 'assets/placeholder-cookie.png',
    imageAlt: gallery[0]?.alt || node.title,
    gallery: gallery,
    variants: variants,
    tags: node.tags,
    isSignature: node.tags.includes('Badge: Signature'),
    isUnique: node.tags.includes('Badge: Unique')
  };
}

/**
 * Format price object { amount, currencyCode } -> "₹89"
 */
function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: price.currencyCode,
    minimumFractionDigits: 0
  }).format(price.amount);
}

/**
 * Fetch products from a specific collection by handle
 */
export async function fetchCollection(handle) {
  const query = `
      query getCollection($handle: String!) {
        collection(handle: $handle) {
          products(first: 10) {
            edges {
              node {
                id
                title
                handle
                description
                descriptionHtml
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 10) {
                  edges {
                    node {
                      url
                      altText
                      width
                      height
                    }
                  }
                }
                tags
                variants(first: 10) {
                    edges {
                        node {
                            id
                            title
                            price {
                                amount
                                currencyCode
                            }
                            compareAtPrice {
                                amount
                                currencyCode
                            }
                            selectedOptions {
                                name
                                value
                            }
                            image {
                                url
                                altText
                            }
                        }
                    }
                }
              }
            }
          }
        }
      }
    `;

  const data = await shopifyFetch({ query, variables: { handle } });
  return data?.collection?.products?.edges.map(edge => normalizeProduct(edge.node)) || [];
}

// Temporary test function to verify connection
export async function testConnection() {
  console.log('Testing Shopify Connection...');
  const products = await fetchProducts();
  console.log('Fetched Products:', products);
  return products;
}
